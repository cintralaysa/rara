import { NextRequest, NextResponse } from 'next/server';
import { sanitizeString, checkRateLimit, getClientIP, isNotEmpty } from '@/lib/security';

// Configuracao do OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface LyricsRequest {
  relationship: string;
  relationshipLabel: string;
  honoreeName: string;
  occasion: string;
  occasionLabel: string;
  musicStyle: string;
  musicStyleLabel: string;
  voicePreference: string;
  qualities: string;
  memories: string;
  heartMessage: string;
  familyNames?: string;
  knowsBabySex?: string;
  babySex?: string;
  babyNameBoy?: string;
  babyNameGirl?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting por IP
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(`lyrics:${clientIP}`, 10, 60000); // 10 requisicoes por minuto

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Muitas requisicoes. Aguarde um momento.' },
        { status: 429 }
      );
    }

    const rawData = await request.json();

    // Sanitizar todos os inputs
    const data: LyricsRequest = {
      relationship: sanitizeString(rawData.relationship, 50),
      relationshipLabel: sanitizeString(rawData.relationshipLabel, 50),
      honoreeName: sanitizeString(rawData.honoreeName, 100),
      occasion: sanitizeString(rawData.occasion, 50),
      occasionLabel: sanitizeString(rawData.occasionLabel, 50),
      musicStyle: sanitizeString(rawData.musicStyle, 50),
      musicStyleLabel: sanitizeString(rawData.musicStyleLabel, 50),
      voicePreference: sanitizeString(rawData.voicePreference, 30),
      qualities: sanitizeString(rawData.qualities, 500),
      memories: sanitizeString(rawData.memories, 800),
      heartMessage: sanitizeString(rawData.heartMessage, 500),
      familyNames: sanitizeString(rawData.familyNames, 300),
      knowsBabySex: sanitizeString(rawData.knowsBabySex, 10),
      babySex: sanitizeString(rawData.babySex, 20),
      babyNameBoy: sanitizeString(rawData.babyNameBoy, 100),
      babyNameGirl: sanitizeString(rawData.babyNameGirl, 100),
    };

    // Validacao basica
    if (!isNotEmpty(data.honoreeName, 2)) {
      return NextResponse.json(
        { error: 'Nome do homenageado e obrigatorio' },
        { status: 400 }
      );
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Servico temporariamente indisponivel' },
        { status: 503 }
      );
    }

    // Construir o prompt para o GPT
    const prompt = buildPrompt(data);

    // Chamar a API do OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Voce e um compositor musical brasileiro EXCEPCIONAL. Voce cria letras que EMOCIONAM PROFUNDAMENTE, fazem as pessoas CHORAREM de alegria e guardam para sempre no coracao.

🎯 SUA MISSAO:
Criar a letra mais BONITA, EMOCIONANTE e TOCANTE que essa familia ja ouviu. Cada palavra deve ser escolhida com carinho. A musica deve fazer quem ouvir sentir um aperto no peito de tanta emocao.

📝 REGRAS DE COMPOSICAO:
1. Escreva em portugues brasileiro, com linguagem poetica mas acessivel
2. Use o nome da pessoa homenageada de forma natural e carinhosa
3. Transforme as memorias e qualidades em versos que toquem a alma
4. Adapte o vocabulario e ritmo ao estilo musical escolhido
5. Estrutura: Verso 1, Refrao, Verso 2, Refrao, Ponte (opcional), Refrao Final
6. Entre 150-250 palavras (exceto cha revelacao com dois finais)
7. Seja GENUINAMENTE emotivo - faca quem ouvir chorar de emocao
8. Use metaforas bonitas, imagens poeticas, expressoes que tocam o coracao
9. Evite cliches vazios - cada verso deve ter significado profundo

🍼 REGRA ESPECIAL PARA CHA REVELACAO:
- Se os pais JA SABEM o sexo: Crie UMA letra unica celebrando o bebe com seu nome
- Se os pais NAO SABEM o sexo: Crie com dois finais (menino/menina) apos contagem de suspense

FORMATO DE SAIDA:
Retorne APENAS a letra da musica, sem explicacoes.
Use quebras de linha para separar as secoes.
Coloque o nome da secao em colchetes: [Verso 1], [Refrao], etc.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'Erro ao gerar letra. Tente novamente.' },
        { status: 500 }
      );
    }

    const result = await response.json();
    const lyrics = result.choices[0]?.message?.content?.trim();

    if (!lyrics) {
      return NextResponse.json(
        { error: 'Nao foi possivel gerar a letra. Tente novamente.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      lyrics,
      success: true
    });

  } catch (error) {
    console.error('Error generating lyrics:', error);
    return NextResponse.json(
      { error: 'Erro interno ao gerar letra.' },
      { status: 500 }
    );
  }
}

function buildPrompt(data: LyricsRequest): string {
  let prompt = `Crie uma letra de musica personalizada com as seguintes informacoes:

📋 DETALHES DO PEDIDO:
- Para quem: ${data.honoreeName} (${data.relationshipLabel})
- Ocasiao: ${data.occasionLabel}
- Estilo musical: ${data.musicStyleLabel}
- Preferencia de voz: ${data.voicePreference === 'feminina' ? 'Voz feminina' : data.voicePreference === 'masculina' ? 'Voz masculina' : 'Sem preferencia'}
`;

  // Adicionar informacoes de cha revelacao se aplicavel
  if (data.occasion === 'cha-revelacao' || data.occasion === 'cha-bebe') {
    prompt += `\n\n🍼 INFORMACOES DO CHA REVELACAO:`;

    if (data.knowsBabySex === 'sim' && data.babySex) {
      // CLIENTE JA SABE O SEXO - LETRA UNICA
      const babyName = data.babySex === 'menino' ? data.babyNameBoy : data.babyNameGirl;
      const emoji = data.babySex === 'menino' ? '💙' : '💖';
      const genero = data.babySex === 'menino' ? 'menino' : 'menina';

      prompt += `\n
✅ OS PAIS JA SABEM O SEXO DO BEBE!
- E ${genero === 'menino' ? 'um MENINO' : 'uma MENINA'}! ${emoji}
- Nome do bebe: ${babyName}

📝 INSTRUCOES (LETRA UNICA):
Crie UMA letra completa e emocionante que:
- Celebre a chegada de ${babyName}
- Use o nome "${babyName}" de forma carinhosa ao longo da letra
- Fale sobre a expectativa, o amor, os sonhos para ${genero === 'menino' ? 'ele' : 'ela'}
- Inclua a revelacao de forma emocionante: "E ${genero === 'menino' ? 'um menino' : 'uma menina'}!"
- Faca os pais chorarem de emocao
- NAO faca dois finais - apenas UMA letra completa`;

    } else if (data.knowsBabySex === 'nao') {
      // CLIENTE NAO SABE O SEXO - DOIS FINAIS
      prompt += `\n
⚠️ OS PAIS NAO SABEM O SEXO DO BEBE - DOIS FINAIS OBRIGATORIOS!
- Nome se for menino: ${data.babyNameBoy || '[Nome do menino]'}
- Nome se for menina: ${data.babyNameGirl || '[Nome da menina]'}

📝 INSTRUCOES (ESTRUTURA ESPECIAL COM DOIS FINAIS):

1. PARTE COMUM (Versos iniciais):
   - Fale sobre a expectativa, a alegria da familia, a ansiedade do momento
   - Crie emocao e suspense - "Quem sera que vem ai?"
   - NAO mencione o sexo ainda

2. [Contagem do Suspense] (OBRIGATORIO):
   - Crie tensao maxima para o momento da revelacao
   - Exemplo: "O coracao dispara, a hora chegou... Tres... Dois... Um..."
   - Faca todo mundo prender a respiracao!

3. DOIS FINAIS DIFERENTES (OBRIGATORIO):

   [Final Versao Menino 💙]
   - "E um menino!" de forma emocionante
   - Use o nome ${data.babyNameBoy}
   - Celebre a chegada do principe

   [Final Versao Menina 💖]
   - "E uma menina!" de forma emocionante
   - Use o nome ${data.babyNameGirl}
   - Celebre a chegada da princesa

⚠️ IMPORTANTE: Os dois finais devem ter a mesma estrutura ritmica para funcionar com a mesma melodia!`;
    }
  }

  if (data.qualities && data.qualities.trim()) {
    prompt += `\n\n💝 QUALIDADES DA PESSOA:
${data.qualities}`;
  }

  if (data.memories && data.memories.trim()) {
    prompt += `\n\n🎵 MEMORIAS ESPECIAIS:
${data.memories}`;
  }

  if (data.heartMessage && data.heartMessage.trim()) {
    prompt += `\n\n💌 MENSAGEM DO CORACAO:
${data.heartMessage}`;
  }

  if (data.familyNames && data.familyNames.trim()) {
    prompt += `\n\n👨‍👩‍👧‍👦 FAMILIARES PARA MENCIONAR NA MUSICA:
${data.familyNames}
(Use esses nomes naturalmente na letra quando fizer sentido, ate 10 nomes)`;
  }

  prompt += `\n\n🎼 INSTRUCOES FINAIS - FACA UMA OBRA-PRIMA:
- Estilo: ${data.musicStyleLabel} - adapte o vocabulario e ritmo ao estilo
- Ocasiao: ${data.occasionLabel} - capture toda a emocao desse momento
- Use as memorias e qualidades fornecidas para criar versos UNICOS e PESSOAIS
- Cada verso deve ter significado profundo - nada generico!
- Faca ${data.honoreeName} e toda a familia CHORAREM de emocao
- Use metaforas poeticas, imagens bonitas, expressoes que tocam a alma
- Esta musica sera guardada para sempre - faca valer a pena!

🌟 LEMBRE-SE: Voce esta criando uma memoria eterna. De o seu melhor!`;

  return prompt;
}

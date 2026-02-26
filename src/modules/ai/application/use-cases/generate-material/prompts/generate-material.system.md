Geração Estruturada de Material Pedagógico com Suporte a Imagem

A resposta deve retornar exclusivamente JSON válido.
Não incluir comentários, explicações, texto fora do JSON ou blocos de markdown.

Objetivo:
Gerar material pedagógico individual baseado na aula fornecida e no perfil do aluno.

Regras obrigatórias:
A resposta deve conter apenas a seguinte estrutura:

{
  "cards": [
    {
      "title": "",
      "text": "",
      "imagePrompt": ""
    }
  ],
  "board": {
    "title": "",
    "text": "",
    "imagePrompt": ""
  },
  "design": {
    "fontFamily": "",
    "primaryColor": "",
    "secondaryColor": "",
    "recommendedPrintSize": ""
  },
  "tips": [
    "",
    "",
    ""
  ]
}

O array "tips" deve:
- Conter exatamente 3 dicas cruciais e rápidas (max 1 linha cada) para o professor aplicar este material com sucesso.
- Ser extremamente focado e direcionado para o Perfil Neurodivergente do aluno e suas dificuldades específicas.

O array "cards" agora atua como um Gerador de Prancha/Flashcards de Conceitos:
- Você DEVE abstrair os conceitos principais da atividade e gerar entre 4 a 8 "cards" distintos.
- Exemplo: Numa aula sobre o Sistema Solar, gere um card para "Sol", um para "Terra", um para "Órbita", etc.
- O "title" deve ser o Rótulo em Português (ex: "Planeta Terra").
- O "text" pode ser uma explicação curtíssima ou instrução do conceito (Max 2 linhas).
- Ter imagePrompt em inglês OBRIGATÓRIAMENTE.
- O imagePrompt deve ser descritivo, focando APENAS no objeto daquele card específico.
- O imagePrompt deve incluir obrigatoriamente: simple flat illustration, neutral background, soft pastel colors, minimal details, child educational style

O campo "board" deve:
- Representar uma prancha de escolha visual GERAL da atividade.
- Ter um único imagePrompt descritivo em inglês englobando todo o cenário/tema.
- Incluir layout claro e organizado.

O campo "design" deve:
- Sugerir fonte apropriada para material infantil
- Sugerir paleta acessível
- Sugerir tamanho de impressão (ex: A5 horizontal)

Não escrever narrativa direta ao aluno.
Não incluir instruções ao professor.
Não incluir texto explicativo fora do JSON.
Não usar markdown.
Não usar emojis.

O JSON deve ser válido e parseável.
Se a resposta não estiver exatamente nesse formato, ela será considerada inválida.

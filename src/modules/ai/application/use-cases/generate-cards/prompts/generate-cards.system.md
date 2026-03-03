Gerador de Prancha/Flashcards de Conceitos Pedagógicos.

A resposta deve retornar exclusivamente JSON válido.
Não incluir comentários, explicações, texto fora do JSON ou blocos de markdown.

Objetivo:
Gerar cartões visuais para o professor apresentar os conceitos da aula de forma adaptada ao perfil do aluno.

Regras obrigatórias:
A resposta deve conter APENAS a seguinte estrutura:

{
  "cards": [
    {
      "title": "",
      "text": "",
      "imagePrompt": ""
    }
  ],
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

Instruções Adicionais:
- Abstraia conceitos principais da atividade e gere entre 4 a 8 "cards" distintos.
- O campo "title" deve ser o Rótulo em Português.
- O campo "text" deve ser uma explicação curtíssima do conceito (Max 2 linhas).
- O campo "imagePrompt" deve ser descritivo, em INGLÊS, focando APENAS no objeto do card. Inclua: simple flat illustration, neutral background, soft pastel colors, minimal details, child educational style.
- As "tips" devem conter 3 dicas rápidas focadas no perfil neurodivergente do aluno.
- Não incluir texto explicativo fora do JSON.
- O JSON deve ser válido e parseável.

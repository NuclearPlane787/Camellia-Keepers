// Memorial sites that get their own QR code: https://camelliakeepers.com/ask?site=<slug>
//
// name         shown to visitors
// intro        a short welcome shown on the page — TODO: fill from verified sources
//              (the site's own signage, the Jeju 4·3 Peace Foundation). Leave '' until checked;
//              the page then shows a general welcome instead.
// context      one or two sentences given to the model about where the visitor is standing.
//              Facts here are trusted by the model, so only write what has been verified.
// suggestions  tappable starter questions.

export const SITES = {
  'peace-park': {
    name: { ko: '제주4·3평화공원', en: 'Jeju 4·3 Peace Park' },
    intro: { ko: '', en: '' },
    context: '',
    suggestions: {
      ko: ['1948년 4월 3일에 무슨 일이 있었나요?', '4·3으로 몇 명이 희생되었나요?', '왜 동백꽃이 4·3의 상징인가요?'],
      en: ['What happened on April 3, 1948?', 'How many people died in Jeju 4·3?', 'Why is the camellia the symbol of 4·3?'],
    },
  },
  bukchon: {
    name: { ko: '북촌리 너븐숭이 4·3기념관', en: 'Bukchon Neobeunsungi 4·3 Memorial Hall' },
    intro: { ko: '', en: '' },
    context: '',
    suggestions: {
      ko: ['북촌리에서 무슨 일이 있었나요?', '왜 마을 주민들이 희생되었나요?', '생존자와 유족은 어떻게 살아왔나요?'],
      en: ['What happened in Bukchon village?', 'Why were the villagers killed?', 'How did survivors and families live afterwards?'],
    },
  },
  darangshi: {
    name: { ko: '다랑쉬굴', en: 'Darangshi Cave' },
    intro: { ko: '', en: '' },
    context: '',
    suggestions: {
      ko: ['다랑쉬굴에서 무엇이 발견되었나요?', '왜 사람들이 동굴에 숨었나요?', '초토화 작전이란 무엇인가요?'],
      en: ['What was found in Darangshi Cave?', 'Why did people hide in caves?', 'What was the scorched-earth campaign?'],
    },
  },
  'seotal-oreum': {
    name: { ko: '섯알오름 학살터', en: 'Seotal Oreum Massacre Site' },
    intro: { ko: '', en: '' },
    context: '',
    suggestions: {
      ko: ['섯알오름에서 무슨 일이 있었나요?', '예비검속이란 무엇인가요?', '한국전쟁은 4·3에 어떤 영향을 주었나요?'],
      en: ['What happened at Seotal Oreum?', "What was 'preventive detention'?", 'How did the Korean War affect 4·3?'],
    },
  },
  keunneolgwe: {
    name: { ko: '큰넓궤', en: 'Keunneolgwe Cave' },
    intro: { ko: '', en: '' },
    context: '',
    suggestions: {
      ko: ['큰넓궤에는 누가 숨어 지냈나요?', '중산간 마을 사람들에게 무슨 일이 있었나요?', '초토화 작전이란 무엇인가요?'],
      en: ['Who hid in Keunneolgwe?', 'What happened to the mountain villages?', 'What was the scorched-earth campaign?'],
    },
  },
};

// Shown when the page is opened without a site (e.g. from the website menu).
export const GENERAL = {
  name: { ko: '제주 4·3', en: 'Jeju 4·3' },
  intro: { ko: '', en: '' },
  suggestions: {
    ko: ['제주 4·3 사건은 무엇인가요?', '4·3은 왜 오랫동안 이야기되지 못했나요?', '정부는 언제 사과했나요?'],
    en: ['What was the Jeju 4·3 Incident?', 'Why was 4·3 kept silent for so long?', 'When did the government apologise?'],
  },
};

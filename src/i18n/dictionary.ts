export const languages = ['kk', 'ru'] as const

export type Language = (typeof languages)[number]

export type Step = {
  title: string
  text: string
}

export type ReportErrors = {
  animal: string
  description: string
  date: string
  time: string
  future: string
  place: string
  point: string
  contact: string
  email: string
  phone: string
}

export type MapCopy = {
  nav: string
  title: string
  demoNotice: string
  filtersLabel: string
  filterAll: string
  filterCats: string
  filterDogs: string
  listTitle: string
  empty: string
  lastKnown: string
  sampleReport: string
  seenAt: string
  sampleReports: string
  draftStatus: string
  draftNotice: string
  draftUntitled: string
  reportSighting: string
  sightingsTitle: string
  sightingsOrder: string
  witnessReport: string
  unconfirmed: string
  sessionOnly: string
  demoReport: string
  noSightings: string
  sessionReports: string
  sightingAdded: string
  sightingPhotoAlt: string
  markFound: string
  confirmFoundTitle: string
  confirmFoundText: string
  confirmFoundYes: string
  confirmFoundNo: string
  foundSuccess: string
  selectPrompt: string
  legendTitle: string
  selectedLabel: string
  otherCards: string
}

export type SightingErrors = {
  point: string
  date: string
  time: string
  future: string
}

export type SightingCopy = {
  title: string
  intro: string
  back: string
  caseLabel: string
  reportFor: string
  when: string
  point: string
  pointHint: string
  pointChosen: string
  date: string
  time: string
  description: string
  descriptionHint: string
  photo: string
  photoHint: string
  photoRemove: string
  photoAlt: string
  privacy: string
  submit: string
  cancel: string
  notFound: string
  errorsTitle: string
  errors: SightingErrors
}

export type ReportCopy = {
  create: string
  title: string
  intro: string
  back: string
  optional: string
  required: string
  requiredNote: string
  groupPet: string
  groupPlace: string
  groupTime: string
  photoChoose: string
  photoReplace: string
  draftBadge: string
  submitHint: string
  previewSaved: string
  animal: string
  name: string
  photo: string
  photoHint: string
  photoRemove: string
  photoAlt: string
  description: string
  date: string
  time: string
  place: string
  placeHint: string
  point: string
  pointHint: string
  pointChosen: string
  showOnMap: string
  sessionDraft: string
  contactPrivate: string
  contact: string
  contactHint: string
  phone: string
  email: string
  submit: string
  previewTitle: string
  previewNote: string
  edit: string
  noPhoto: string
  noName: string
  errorsTitle: string
  errors: ReportErrors
}

export type IllustrationName =
  | 'nightSearch'
  | 'sadCat'
  | 'poster'
  | 'witness'
  | 'pawTrail'
  | 'reunion'

export type Messages = {
  brand: string
  description: string
  languageSwitcher: string
  navigation: string
  menu: string
  menuOpen: string
  menuClose: string
  heroEyebrow: string
  heroTitle: string
  heroText: string
  heroPrimary: string
  heroSecondary: string
  stepsIntro: string
  exampleStart: string
  exampleSeparate: string
  witnessPoints: readonly [string, string, string]
  witnessAction: string
  howItWorks: string
  witnessNav: string
  steps: readonly [Step, Step, Step]
  exampleLabel: string
  exampleTitle: string
  lastSeen: string
  lastSeenNote: string
  witnessMark: string
  witnessMarkNote: string
  exampleNote: string
  witnessTitle: string
  witnessText: string
  helpNav: string
  helpTitle: string
  helpIntro: string
  helpBack: string
  animalPrompt: string
  cat: string
  dog: string
  animalHint: string
  firstStepsTitle: string
  helpGeneralLabel: string
  helpAnimalLabel: string
  helpProgress: string
  helpCreateTitle: string
  helpCreateText: string
  firstSteps: readonly [Step, Step, Step, Step]
  catAdviceTitle: string
  catAdvice: readonly [string, string, string]
  dogAdviceTitle: string
  dogAdvice: readonly [string, string, string]
  report: ReportCopy
  map: MapCopy
  sighting: SightingCopy
  reunionTitle: string
  reunionText: string
  reunionAction: string
  illustrations: Record<IllustrationName, string>
  loading: string
}

export const languageLabels: Record<Language, string> = {
  kk: 'ҚАЗ',
  ru: 'РУС',
}

export const dictionary = {
  kk: {
    brand: 'PettySpot',
    description:
      'PettySpot әрекеттерді ретімен орындауға, соңғы көрген жерді белгілеуге және куәгерлердің хабарламаларын жинауға көмектеседі.',
    languageSwitcher: 'Тілді таңдау',
    navigation: 'Бет бөлімдері',
    menu: 'Мәзір',
    menuOpen: 'Мәзірді ашу',
    menuClose: 'Мәзірді жабу',
    heroEyebrow: 'Жоғалған үй жануарларын іздеу көмекшісі',
    heroPrimary: 'Қазір не істеу керек',
    heroSecondary: 'Картаны ашу',
    stepsIntro:
      'Үш қарапайым қадам: карточка, бір бастапқы нүкте және куәгерлердің бөлек хабарламалары.',
    exampleStart: 'Іздеудің басы',
    exampleSeparate: 'Бөлек нүкте',
    witnessPoints: [
      'Кездесу орны — картадағы нүкте',
      'Кездесу күні мен уақыты',
      'Қысқаша сипаттама, қаласаңыз фото',
    ],
    witnessAction: 'Картадан карточканы табу',
    heroTitle: 'Жануар жоғалып кеткенде, неден бастау керегін білу маңызды',
    heroText:
      'PettySpot әрекеттерді ретімен орындауға, соңғы көрген жерді белгілеуге және куәгерлердің хабарламаларын жинауға көмектеседі.',
    howItWorks: 'Іздеу қалай жүреді',
    witnessNav: 'Куәгерлерге',
    steps: [
      {
        title: 'Іздеу карточкасын жасаңыз',
        text: 'Атын, белгілерін және сізбен қалай байланысу керегін жазыңыз.',
      },
      {
        title: 'Соңғы көрген жерді белгілеңіз',
        text: 'Бұл іздеу басталатын бір нүкте. Ол дайын бағыт емес.',
      },
      {
        title: 'Жаңа кездесулер туралы хабарламаларды қосыңыз',
        text: 'Әр кездесу жері мен уақыты бар бөлек нүкте болып қалады.',
      },
    ],
    exampleLabel: 'Мысал',
    exampleTitle: 'Іздеу карточкасы',
    lastSeen: 'Соңғы көрген жер',
    lastSeenNote: 'Іздеу басталатын нүкте',
    witnessMark: 'Куәгердің жаңа хабарламасы',
    witnessMarkNote: 'Кездескен жер мен уақыт, бөлек нүкте',
    exampleNote:
      'Бұл карточканың мысалы, карта емес. Белгілер расталған бағытқа айналмайды.',
    witnessTitle: 'Жануарды көрдіңіз бе?',
    witnessText:
      'Кездескен жер мен уақытты жазыңыз. Бұл куәгердің белгісі: жануардың әлі сол жерде екенін растамайды.',
    helpNav: 'Не істеу керек',
    helpTitle: 'Жануар жоғалып кетсе, не істеу керек',
    helpIntro:
      'Алдымен деректерді жинап, жақын маңайдан бастаңыз. Жарақат бар болса, бұл қадамдар ветеринар көмегін алмастырмайды.',
    helpBack: 'Басты бетке',
    animalPrompt: 'Кімді іздеп жүрсіз?',
    cat: 'Мысық',
    dog: 'Ит',
    animalHint: 'Жеке кеңес көру үшін мысықты немесе итті таңдаңыз.',
    firstStepsTitle: 'Алғашқы қадамдар',
    helpGeneralLabel: 'Кез келген жануар үшін',
    helpAnimalLabel: 'Таңдалған жануарға арналған кеңес',
    helpProgress: '{done} / {total} орындалды',
    helpCreateTitle: 'Іздеу карточкасын жасаңыз',
    helpCreateText:
      'Белгілерін, соңғы көрген жерді және уақытты жазыңыз. Карточка осы сеанста ғана қалады.',
    firstSteps: [
      {
        title: 'Фото, сипаттама, уақыт пен жерді дайындаңыз',
        text: 'Анық фото түсіріп, белгілерін және соңғы рет қашан, қайда көргеніңізді жазып алыңыз.',
      },
      {
        title: 'Жақын жерлерді тексеріп, маңайдағы адамдардан сұраңыз',
        text: 'Ауланы, кіреберістерді және тыныш бұрыштарды қараңыз. Көршілерден жануарды көргенін сұраңыз.',
      },
      {
        title: 'Жергілікті ветклиникалар мен паналарға хабарлаңыз',
        text: 'Фото мен белгілерді айтыңыз. Ұқсас жануарды әкелсе, сізге хабарлауын өтініңіз.',
      },
      {
        title: 'Жануарды көрген адамнан нақты жер мен уақытты сұраңыз',
        text: 'Оның соңынан қууды өтінбеңіз. Нақты жер мен уақыт қуудан гөрі пайдалы.',
      },
    ],
    catAdviceTitle: 'Мысық жоғалса',
    catAdvice: [
      'Мысықтар көбіне үйдің маңында тығылады және шақырғанда үн қатпауы мүмкін.',
      'Сарай, жертөле, бұта және көлік астын тексеріңіз. Үйреншікті дауыспен байсалды шақырыңыз.',
      'Тамақты бөтен жануарлар жиналатын қауіпті жерге қоймаңыз. Үй есігінің алдындағы шағын ыдыс кейде мысықтың өзі оралуына көмектеседі.',
    ],
    dogAdviceTitle: 'Ит жоғалса',
    dogAdvice: [
      'Ит қорқып кетсе, үйден алысырақ кетуі мүмкін.',
      'Таныс серуен жолдары мен оған әдетте қызық жерлерді қараңыз.',
      'Итті көрген адамнан соңынан жүгірмеуін және ұстамауын өтініңіз. Жерін, уақытын және қай жаққа кеткенін жазып алсын.',
    ],
    report: {
      create: 'Іздеу карточкасын жасау',
      title: 'Іздеу карточкасы',
      intro:
        'Білетініңізді жазыңыз. Деректер осы бетте қалады және ешқайда жіберілмейді.',
      back: 'Көмек бетіне',
      optional: 'міндетті емес',
      required: 'міндетті',
      requiredNote: 'Жұлдызшамен (*) белгіленген өрістер міндетті.',
      groupPet: 'Жануар',
      groupPlace: 'Соңғы белгілі орын',
      groupTime: 'Соңғы рет қашан көрдіңіз',
      photoChoose: 'Фото таңдау',
      photoReplace: 'Фотоны ауыстыру',
      draftBadge: 'Жергілікті жоба',
      submitHint:
        'Батырма карточканы жарияламайды: тек осы сеанста сақталатын жобаның алдын ала көрінісі ашылады.',
      previewSaved: 'Жоба осы сеанста сақталды',
      animal: 'Жануар түрі',
      name: 'Аты',
      photo: 'Фото',
      photoHint: 'Файл тек осы беттегі браузерде қалады.',
      photoRemove: 'Фотоны алып тастау',
      photoAlt: 'Фотоның алдын ала көрінісі',
      description: 'Сипаттама және ерекше белгілер',
      date: 'Соңғы рет көрген күн',
      time: 'Уақыт',
      place: 'Шамамен қай жерде',
      placeHint: 'Аудан, аула немесе бағдар. Үй мекенжайын жазбаңыз.',
      point: 'Картадағы нүкте',
      pointHint: 'Шамамен жерді белгілеу үшін картаны басыңыз. Үй мекенжайы керек емес.',
      pointChosen: 'Нүкте белгіленді',
      showOnMap: 'Картадан көрсету',
      sessionDraft:
        'Бұл осы сеанстың жергілікті жобасы. Ол жарияланбаған және басқа адамдарға көрінбейді.',
      contactPrivate: 'Телефон мен email картадағы жалпы тізімде көрсетілмейді.',
      contact: 'Иесінің байланысы',
      contactHint: 'Телефон немесе email жеткілікті.',
      phone: 'Телефон',
      email: 'Email',
      submit: 'Алдын ала қарау',
      previewTitle: 'Карточканы алдын ала қарау',
      previewNote:
        'Бұл алдын ала қарау. Карточка әлі жарияланған жоқ және ешқайда жіберілген жоқ.',
      edit: 'Өңдеуге оралу',
      noPhoto: 'Фото қосылмаған',
      noName: 'Аты көрсетілмеген',
      errorsTitle: 'Өрістерді тексеріңіз',
      errors: {
        animal: 'Мысықты немесе итті таңдаңыз.',
        description: 'Жануарды және ерекше белгілерін сипаттаңыз.',
        date: 'Соңғы рет көрген күнді көрсетіңіз.',
        time: 'Уақытты көрсетіңіз.',
        future: 'Күн мен уақыт болашақта болмауы керек.',
        place: 'Жануарды көрген шамамен жерді жазыңыз.',
        point: 'Картадан шамамен жерді белгілеңіз.',
        contact: 'Телефон немесе email жазыңыз.',
        email: 'Email-ді тексеріңіз: онда ат пен домен болуы керек.',
        phone: 'Телефонды тексеріңіз: кемінде 10 сан керек.',
      },
    },
    map: {
      nav: 'Карта',
      title: 'Іздеу картасы',
      demoNotice:
        'Нүктелер — оқу мысалдары. Бұл нақты хабарламалар емес және бағытты білдірмейді.',
      filtersLabel: 'Сүзгі',
      filterAll: 'Барлығы',
      filterCats: 'Мысықтар',
      filterDogs: 'Иттер',
      listTitle: 'Көрсетілім карточкалары',
      empty: 'Бұл сүзгіде көрсетілім карточкалары жоқ.',
      lastKnown: 'Соңғы көрген жер',
      sampleReport: 'Куәгер хабарламасының мысалы',
      seenAt: 'Уақыт',
      sampleReports: 'Мысал хабарламалар',
      draftStatus: 'Осы сеанстың жобасы',
      draftNotice:
        'Бұл жоба тек осы сеанста көрінеді және басқа адамдар үшін жарияланбаған.',
      draftUntitled: 'Аты жоқ жоба',
      reportSighting: 'Кездесу туралы хабарлау',
      sightingsTitle: 'Куәгерлердің хабарламалары',
      sightingsOrder: 'Уақыт бойынша, ертерегінен бастап.',
      witnessReport: 'Куәгер хабарламасы',
      unconfirmed: 'Расталмаған',
      sessionOnly: 'Тек осы сеанста қолжетімді',
      demoReport: 'Көрсетілім мысалы',
      noSightings: 'Әзірге хабарламалар жоқ.',
      sessionReports: 'Осы сеанстың хабарламалары',
      sightingAdded:
        'Хабарлама қосылды. Ол картада бөлек нүкте болып көрсетілді және тек осы сеанста қолжетімді.',
      sightingPhotoAlt: 'Куәгер қосқан фото',
      markFound: 'Жануар табылды',
      confirmFoundTitle: 'Жануар табылды деп белгілеу керек пе?',
      confirmFoundText:
        'Карточка белсенді іздеуден және картадан жойылады. Бұл әрекетті болдырмау мүмкін емес, бірақ дерек бетті қайта жүктегенге дейін осы сеанста сақталады.',
      confirmFoundYes: 'Иә, табылды',
      confirmFoundNo: 'Бас тарту',
      selectPrompt:
        'Толығырақ ақпарат пен хабарламаларды көру үшін тізімнен карточканы немесе картадан нүктені таңдаңыз.',
      legendTitle: 'Белгілер',
      selectedLabel: 'Таңдалған карточка',
      otherCards: 'Барлық карточкалар',
      foundSuccess:
        '«{name}» табылды деп белгіленді. Карточка белсенді іздеуден алынды. Жануардың табылғанына қуаныштымыз!',
    },
    sighting: {
      title: 'Кездесу туралы хабарлама',
      intro:
        'Жануарды қай жерде және қашан көргеніңізді белгілеңіз. Хабарлама тек осы сеанста сақталады және ешқайда жіберілмейді.',
      back: 'Картаға оралу',
      caseLabel: 'Карточка',
      reportFor: 'Хабарлама осы карточка үшін',
      when: 'Кездесу күні мен уақыты',
      point: 'Кездесу орны',
      pointHint:
        'Жануарды көрген жерді картаны басып белгілеңіз. Соңғы көрген жердің белгісі өзгермейді.',
      pointChosen: 'Кездесу нүктесі белгіленді',
      date: 'Кездесу күні',
      time: 'Кездесу уақыты',
      description: 'Қысқаша сипаттама',
      descriptionHint:
        'Не көрдіңіз және жануар қай жаққа кетті. Байланыс деректерін жазбаңыз.',
      photo: 'Фото',
      photoHint: 'Файл тек осы сеанста браузерде қалады және ешқайда жүктелмейді.',
      photoRemove: 'Фотоны алып тастау',
      photoAlt: 'Кездесу фотосының алдын ала көрінісі',
      privacy: 'Куәгердің байланыс деректері жиналмайды.',
      submit: 'Хабарламаны жіберу',
      cancel: 'Бас тарту',
      notFound: 'Карточка табылмады. Картаға оралып, карточканы қайта таңдаңыз.',
      errorsTitle: 'Өрістерді тексеріңіз',
      errors: {
        point: 'Картаны басып, кездесу орнын белгілеңіз.',
        date: 'Кездесу күнін көрсетіңіз.',
        time: 'Кездесу уақытын көрсетіңіз.',
        future: 'Кездесу күні мен уақыты болашақта болмауы керек.',
      },
    },
    reunionTitle: 'Оларды бірге үйге қайтарайық',
    reunionText:
      'Іздеу карточкасынан бастаңыз: соңғы көрген жер мен куәгерлердің әр хабарламасы жануарды табуға көмектеседі.',
    reunionAction: 'Іздеу карточкасын жасау',
    illustrations: {
      nightSearch: 'Түнде қол шамымен жоғалған итті іздеп жүрген адам, жерде табан іздері',
      sadCat: 'Кешкі көше шамының астында жалғыз отырған мысық',
      poster: 'Бағанға жоғалған жануар туралы табан суреті бар хабарландыру ілген әйел',
      witness: 'Ит көрген адам телефоннан карта нүктесін белгілеп тұр',
      pawTrail: 'Қала саябағы арқылы созылған табан іздері және бұтаның артындағы жануар',
      reunion: 'Табылған итін құшақтап, қуанып тұрған адам',
    },
    loading: 'Жүктелуде…',
  },
  ru: {
    brand: 'PettySpot',
    description:
      'PettySpot помогает действовать по шагам, отметить последнее место и собрать сообщения очевидцев.',
    languageSwitcher: 'Выбор языка',
    navigation: 'Разделы страницы',
    menu: 'Меню',
    menuOpen: 'Открыть меню',
    menuClose: 'Закрыть меню',
    heroEyebrow: 'Помощник в поиске пропавших питомцев',
    heroPrimary: 'Что делать сейчас',
    heroSecondary: 'Открыть карту',
    stepsIntro:
      'Три простых шага: карточка, одна исходная точка и отдельные сообщения очевидцев.',
    exampleStart: 'Начало поиска',
    exampleSeparate: 'Отдельная точка',
    witnessPoints: [
      'Место встречи — точкой на карте',
      'Дата и время встречи',
      'Короткое описание, по желанию фото',
    ],
    witnessAction: 'Найти карточку на карте',
    heroTitle: 'Когда пропал питомец, важно знать, с чего начать',
    heroText:
      'PettySpot помогает действовать по шагам, отметить последнее место и собрать сообщения очевидцев.',
    howItWorks: 'Как работает поиск',
    witnessNav: 'Очевидцам',
    steps: [
      {
        title: 'Создайте карточку поиска',
        text: 'Укажите кличку, приметы и как с вами связаться.',
      },
      {
        title: 'Укажите последнее известное место',
        text: 'Это одна точка, с которой начинается поиск, а не маршрут.',
      },
      {
        title: 'Добавляйте сообщения о новых встречах',
        text: 'Каждая встреча остаётся отдельной точкой с местом и временем.',
      },
    ],
    exampleLabel: 'Пример',
    exampleTitle: 'Карточка поиска',
    lastSeen: 'Последнее известное место',
    lastSeenNote: 'Точка, с которой начинается поиск',
    witnessMark: 'Новое сообщение очевидца',
    witnessMarkNote: 'Место и время встречи, отдельной точкой',
    exampleNote:
      'Это пример карточки, не карта. Отметки не складываются в подтверждённый маршрут.',
    witnessTitle: 'Видели питомца?',
    witnessText:
      'Укажите место и время встречи. Это заметка очевидца: она не подтверждает, что питомец всё ещё там.',
    helpNav: 'Что делать',
    helpTitle: 'Что делать, если питомец пропал',
    helpIntro:
      'Сначала соберите факты и начните с ближайших мест. Если питомец ранен, эти шаги не заменяют помощь ветеринара.',
    helpBack: 'На главную',
    animalPrompt: 'Кого ищете?',
    cat: 'Кошка',
    dog: 'Собака',
    animalHint: 'Выберите кошку или собаку, чтобы увидеть отдельные советы.',
    firstStepsTitle: 'Первые шаги',
    helpGeneralLabel: 'Для любого питомца',
    helpAnimalLabel: 'Советы для выбранного животного',
    helpProgress: 'Выполнено {done} из {total}',
    helpCreateTitle: 'Создайте карточку поиска',
    helpCreateText:
      'Укажите приметы, последнее известное место и время. Карточка остаётся только в этом сеансе.',
    firstSteps: [
      {
        title: 'Подготовьте фото, описание, время и место',
        text: 'Сделайте ясные фото и запишите приметы, а также когда и где питомца видели в последний раз.',
      },
      {
        title: 'Проверьте ближайшие места и спросите людей рядом',
        text: 'Обойдите двор, подъезды и тихие углы. Спросите соседей, не видели ли они животное.',
      },
      {
        title: 'Сообщите в местные ветклиники и приюты',
        text: 'Передайте фото и приметы. Попросите предупредить вас, если принесут похожее животное.',
      },
      {
        title: 'Если питомца увидели, попросите указать место и время',
        text: 'Не просите гнаться за ним. Точное место и время полезнее погони.',
      },
    ],
    catAdviceTitle: 'Если пропала кошка',
    catAdvice: [
      'Кошки часто прячутся рядом с домом и могут не откликаться на зов.',
      'Проверьте сараи, подвалы, кусты и место под машинами. Зовите спокойно, привычным голосом.',
      'Не оставляйте еду там, где она может собрать других животных в опасном месте. Небольшая миска у двери дома иногда помогает кошке вернуться самой.',
    ],
    dogAdviceTitle: 'Если пропала собака',
    dogAdvice: [
      'Испуганная собака может уйти дальше от дома.',
      'Пройдите знакомые маршруты прогулок и места, которые ей обычно интересны.',
      'Если собаку увидели, попросите не бежать за ней и не хватать её. Пусть запишут место, время и в какую сторону она пошла.',
    ],
    report: {
      create: 'Создать карточку поиска',
      title: 'Карточка поиска',
      intro:
        'Заполните то, что знаете. Данные остаются на этой странице и никуда не отправляются.',
      back: 'К странице помощи',
      optional: 'необязательно',
      required: 'обязательно',
      requiredNote: 'Поля со звёздочкой (*) обязательны.',
      groupPet: 'Питомец',
      groupPlace: 'Последнее известное место',
      groupTime: 'Когда видели в последний раз',
      photoChoose: 'Выбрать фото',
      photoReplace: 'Заменить фото',
      draftBadge: 'Локальный черновик',
      submitHint:
        'Кнопка не публикует карточку: откроется предпросмотр черновика, который хранится только в этом сеансе.',
      previewSaved: 'Черновик сохранён в этом сеансе',
      animal: 'Вид животного',
      name: 'Кличка',
      photo: 'Фотография',
      photoHint: 'Файл остаётся только в браузере на этой странице.',
      photoRemove: 'Убрать фото',
      photoAlt: 'Предпросмотр фотографии',
      description: 'Описание и особые приметы',
      date: 'Дата, когда видели в последний раз',
      time: 'Время',
      place: 'Примерное место',
      placeHint: 'Район, двор или ориентир. Не пишите домашний адрес.',
      point: 'Точка на карте',
      pointHint: 'Нажмите на карту, чтобы отметить примерное место. Домашний адрес не нужен.',
      pointChosen: 'Точка отмечена',
      showOnMap: 'Показать на карте',
      sessionDraft:
        'Это локальный черновик текущего сеанса. Он не опубликован и не виден другим людям.',
      contactPrivate: 'Телефон и email не попадут в общий список на карте.',
      contact: 'Контакт владельца',
      contactHint: 'Достаточно телефона или email.',
      phone: 'Телефон',
      email: 'Email',
      submit: 'Показать предпросмотр',
      previewTitle: 'Предпросмотр карточки',
      previewNote:
        'Это предпросмотр. Карточка ещё не опубликована и никуда не отправлена.',
      edit: 'Вернуться к редактированию',
      noPhoto: 'Фото не добавлено',
      noName: 'Кличка не указана',
      errorsTitle: 'Проверьте поля',
      errors: {
        animal: 'Выберите кошку или собаку.',
        description: 'Опишите питомца и особые приметы.',
        date: 'Укажите дату, когда питомца видели в последний раз.',
        time: 'Укажите время.',
        future: 'Дата и время не могут быть в будущем.',
        place: 'Укажите примерное место, где питомца видели.',
        point: 'Отметьте примерное место на карте.',
        contact: 'Укажите телефон или email.',
        email: 'Проверьте email: в нём должны быть имя и домен.',
        phone: 'Проверьте телефон: нужно не меньше 10 цифр.',
      },
    },
    map: {
      nav: 'Карта',
      title: 'Карта поиска',
      demoNotice:
        'Точки на карте — учебные примеры. Это не реальные сообщения и не маршрут.',
      filtersLabel: 'Фильтр',
      filterAll: 'Все',
      filterCats: 'Кошки',
      filterDogs: 'Собаки',
      listTitle: 'Демонстрационные карточки',
      empty: 'Для этого фильтра нет демонстрационных карточек.',
      lastKnown: 'Последнее известное место',
      sampleReport: 'Пример сообщения очевидца',
      seenAt: 'Время',
      sampleReports: 'Примеры сообщений',
      draftStatus: 'Черновик этого сеанса',
      draftNotice:
        'Этот черновик виден только в текущем сеансе и не опубликован для других людей.',
      draftUntitled: 'Черновик без клички',
      reportSighting: 'Сообщить о встрече',
      sightingsTitle: 'Сообщения очевидцев',
      sightingsOrder: 'По времени, сначала ранние.',
      witnessReport: 'Сообщение очевидца',
      unconfirmed: 'Не подтверждено',
      sessionOnly: 'Доступно только в этом сеансе',
      demoReport: 'Демонстрационный пример',
      noSightings: 'Пока сообщений нет.',
      sessionReports: 'Сообщения этого сеанса',
      sightingAdded:
        'Сообщение добавлено. Оно показано на карте отдельной точкой и доступно только в этом сеансе.',
      sightingPhotoAlt: 'Фото от очевидца',
      markFound: 'Питомец найден',
      confirmFoundTitle: 'Отметить, что питомец найден?',
      confirmFoundText:
        'Карточка исчезнет из активного поиска и с карты. Отменить это действие нельзя, но данные сохранятся в этом сеансе до перезагрузки страницы.',
      confirmFoundYes: 'Да, питомец найден',
      confirmFoundNo: 'Отмена',
      selectPrompt:
        'Выберите карточку в списке или точку на карте, чтобы увидеть детали и сообщения.',
      legendTitle: 'Обозначения',
      selectedLabel: 'Выбранная карточка',
      otherCards: 'Все карточки',
      foundSuccess:
        'Карточка «{name}» отмечена как «Питомец найден» и убрана из активного поиска. Рады, что питомец нашёлся!',
    },
    sighting: {
      title: 'Сообщение о встрече',
      intro:
        'Отметьте, где и когда вы видели животное. Сообщение хранится только в текущем сеансе и никуда не отправляется.',
      back: 'Вернуться к карте',
      caseLabel: 'Карточка',
      reportFor: 'Сообщение для карточки',
      when: 'Дата и время встречи',
      point: 'Место встречи',
      pointHint:
        'Нажмите на карту там, где видели животное. Отметка последнего известного места не изменится.',
      pointChosen: 'Точка встречи отмечена',
      date: 'Дата встречи',
      time: 'Время встречи',
      description: 'Короткое описание',
      descriptionHint:
        'Что вы видели и куда направилось животное. Не указывайте контактные данные.',
      photo: 'Фотография',
      photoHint: 'Файл остаётся только в браузере в этом сеансе и никуда не загружается.',
      photoRemove: 'Убрать фото',
      photoAlt: 'Предпросмотр фото встречи',
      privacy: 'Контактные данные очевидца не собираются.',
      submit: 'Отправить сообщение',
      cancel: 'Отмена',
      notFound: 'Карточка не найдена. Вернитесь к карте и выберите карточку заново.',
      errorsTitle: 'Проверьте поля',
      errors: {
        point: 'Отметьте место встречи кликом по карте.',
        date: 'Укажите дату встречи.',
        time: 'Укажите время встречи.',
        future: 'Дата и время встречи не могут быть в будущем.',
      },
    },
    reunionTitle: 'Вернём их домой вместе',
    reunionText:
      'Начните с карточки поиска: последнее известное место и каждое сообщение очевидцев помогают найти питомца.',
    reunionAction: 'Создать карточку поиска',
    illustrations: {
      nightSearch: 'Человек ночью ищет пропавшую собаку с фонариком, на земле следы лап',
      sadCat: 'Одинокая кошка сидит под вечерним уличным фонарём',
      poster: 'Женщина вешает на столб объявление о пропаже с рисунком лапы',
      witness: 'Человек увидел собаку и отмечает точку на карте в телефоне',
      pawTrail: 'Следы лап ведут через городской парк, за кустом прячется питомец',
      reunion: 'Человек радостно обнимает найденную собаку',
    },
    loading: 'Загрузка…',
  },
} satisfies Record<Language, Messages>

export function isLanguage(value: unknown): value is Language {
  return languages.some((language) => language === value)
}

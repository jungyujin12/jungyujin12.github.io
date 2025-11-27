## 6. assets/js/main.js
```javascript
/**
 * 배재대학교 창업지원팀 홍보 웹사이트
 * 메인 JavaScript 파일
 * 
 * [비전공자 수정 가능 포인트]
 * 이 파일은 config/content.json에서 데이터를 불러와서 HTML에 자동으로 채워넣습니다.
 * 텍스트나 이미지를 변경하고 싶다면 config/content.json 파일을 수정하세요.
 * 이 파일(main.js)을 직접 수정할 필요는 없습니다.
 */

// JSON 데이터를 저장할 전역 변수
let contentData = null;

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    loadContent();
});

/**
 * config/content.json 파일을 불러오는 함수
 */
async function loadContent() {
    try {
        const response = await fetch('config/content.json');
        if (!response.ok) {
            throw new Error('content.json 파일을 불러올 수 없습니다.');
        }
        contentData = await response.json();
        
        // 공통 요소 렌더링
        renderNavigation();
        renderFooter();
        
        // 각 페이지별 콘텐츠 렌더링
        const currentPage = getCurrentPage();
        switch(currentPage) {
            case 'index':
                renderIndexPage();
                break;
            case 'programs':
                renderProgramsPage();
                break;
            case 'about':
                renderAboutPage();
                break;
            case 'contact':
                renderContactPage();
                break;
        }
        
        // 모바일 메뉴 이벤트 리스너
        setupMobileMenu();
        
    } catch (error) {
        console.error('콘텐츠 로딩 에러:', error);
        alert('콘텐츠를 불러오는 중 오류가 발생했습니다. config/content.json 파일을 확인해주세요.');
    }
}

/**
 * 현재 페이지 확인
 */
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('programs.html')) return 'programs';
    if (path.includes('about.html')) return 'about';
    if (path.includes('contact.html')) return 'contact';
    return 'index';
}

/**
 * 네비게이션 렌더링
 * [비전공자 수정 포인트]
 * 메뉴 항목을 추가/삭제/수정하려면 content.json의 "nav" 배열을 수정하세요.
 */
function renderNavigation() {
    // 로고 텍스트
    const logoElement = document.getElementById('logoText');
    if (logoElement && contentData.site) {
        logoElement.textContent = contentData.site.logoText || '배재대 창업지원팀';
    }
    
    // 네비게이션 메뉴
    const navMenu = document.getElementById('navMenu');
    if (navMenu && contentData.nav) {
        navMenu.innerHTML = '';
        const currentPage = getCurrentPage();
        
        contentData.nav.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.href;
            a.textContent = item.label;
            
            // 현재 페이지 활성화 표시
            const itemPage = item.href.replace('.html', '').replace('index', 'index');
            if (
                (currentPage === 'index' && item.href === 'index.html') ||
                (currentPage !== 'index' && item.href.includes(currentPage))
            ) {
                a.classList.add('active');
            }
            
            li.appendChild(a);
            navMenu.appendChild(li);
        });
    }
}

/**
 * 푸터 렌더링
 * [비전공자 수정 포인트]
 * 푸터 텍스트나 링크를 수정하려면 content.json의 "footer" 섹션을 수정하세요.
 */
function renderFooter() {
    // 저작권 문구
    const copyrightElement = document.getElementById('footerCopyright');
    if (copyrightElement && contentData.footer) {
        copyrightElement.textContent = contentData.footer.copyright;
    }
    
    // 푸터 링크
    const footerLinks = document.getElementById('footerLinks');
    if (footerLinks && contentData.footer && contentData.footer.links) {
        footerLinks.innerHTML = '';
        contentData.footer.links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.href;
            a.textContent = link.label;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            footerLinks.appendChild(a);
        });
    }
}

/**
 * index.html 페이지 렌더링
 * [비전공자 수정 포인트]
 * 메인 페이지의 텍스트를 수정하려면 content.json의 "landing"과 "sections" 부분을 수정하세요.
 */
function renderIndexPage() {
    // 히어로 섹션
    if (contentData.landing) {
        const heroTitle = document.getElementById('heroTitle');
        const heroSubtitle = document.getElementById('heroSubtitle');
        const heroButton = document.getElementById('heroButton');
        const hero = document.getElementById('hero');
        
        if (heroTitle) heroTitle.textContent = contentData.landing.heroTitle;
        if (heroSubtitle) heroSubtitle.textContent = contentData.landing.heroSubtitle;
        if (heroButton) {
            heroButton.textContent = contentData.landing.heroButtonText;
            heroButton.href = contentData.landing.heroButtonLink;
        }
        
        // 히어로 배경 이미지 설정 (선택사항)
        // [비전공자 수정 포인트]
        // 히어로 섹션에 배경 이미지를 넣으려면 아래 주석을 해제하고
        // content.json의 landing.heroImage 경로에 이미지를 배치하세요.
        /*
        if (hero && contentData.landing.heroImage) {
            hero.style.backgroundImage = `url('${contentData.landing.heroImage}')`;
            hero.style.backgroundSize = 'cover';
            hero.style.backgroundPosition = 'center';
        }
        */
    }
    
    // 간단 소개 섹션
    if (contentData.sections && contentData.sections.briefIntro) {
        const briefIntroTitle = document.getElementById('briefIntroTitle');
        const briefIntroDesc = document.getElementById('briefIntroDesc');
        
        if (briefIntroTitle) briefIntroTitle.textContent = contentData.sections.briefIntro.title;
        if (briefIntroDesc) briefIntroDesc.textContent = contentData.sections.briefIntro.description;
    }
    
    // 4가지 프로그램 요약
    if (contentData.sections && contentData.sections.fourProgramsSummary) {
        const programsSummaryTitle = document.getElementById('programsSummaryTitle');
        const programsGrid = document.getElementById('programsGrid');
        
        if (programsSummaryTitle) {
            programsSummaryTitle.textContent = contentData.sections.fourProgramsSummary.title;
        }
        
        if (programsGrid) {
            programsGrid.innerHTML = '';
            contentData.sections.fourProgramsSummary.items.forEach(item => {
                const card = createProgramCard(item);
                programsGrid.appendChild(card);
            });
        }
    }
}

/**
 * 프로그램 카드 생성 함수
 * [비전공자 수정 포인트]
 * 각 프로그램의 이미지를 변경하려면:
 * 1. assets/img/ 폴더에 새 이미지를 넣고
 * 2. content.json의 해당 프로그램 "image" 필드를 수정하세요.
 */
function createProgramCard(item) {
    const card = document.createElement('div');
    card.className = 'program-card';
    card.onclick = () => window.location.href = 'programs.html';
    
    const img = document.createElement('img');
    img.className = 'program-card-image';
    img.src = item.image;
    img.alt = item.name;
    // 이미지 로드 실패 시 기본 배경색 유지
    img.onerror = function() {
        this.style.display = 'none';
    };
    
    const content = document.createElement('div');
    content.className = 'program-card-content';
    
    const title = document.createElement('h3');
    title.className = 'program-card-title';
    title.textContent = item.name;
    
    const desc = document.createElement('p');
    desc.className = 'program-card-desc';
    desc.textContent = item.shortDesc;
    
    content.appendChild(title);
    content.appendChild(desc);
    card.appendChild(img);
    card.appendChild(content);
    
    return card;
}

/**
 * programs.html 페이지 렌더링
 * [비전공자 수정 포인트]
 * 프로그램 내용을 수정하려면 content.json의 "programs" 배열을 수정하세요.
 */
function renderProgramsPage() {
    const programsDetailList = document.getElementById('programsDetailList');
    
    if (programsDetailList && contentData.programs) {
        programsDetailList.innerHTML = '';
        
        contentData.programs.forEach(program => {
            const card = createProgramDetailCard(program);
            programsDetailList.appendChild(card);
        });
    }
}

/**
 * 프로그램 상세 카드 생성
 */
function createProgramDetailCard(program) {
    const card = document.createElement('div');
    card.className = 'program-detail-card';
    card.id = program.id;
    
    const img = document.createElement('img');
    img.className = 'program-detail-image';
    img.src = program.image;
    img.alt = program.name;
    img.onerror = function() {
        this.style.display = 'none';
    };
    
    const content = document.createElement('div');
    content.className = 'program-detail-content';
    
    const tag = document.createElement('span');
    tag.className = 'program-detail-tag';
    tag.textContent = program.tag;
    
    const title = document.createElement('h2');
    title.className = 'program-detail-title';
    title.textContent = program.name;
    
    const shortDesc = document.createElement('p');
    shortDesc.className = 'program-detail-short';
    shortDesc.textContent = program.shortDesc;
    
    const detail = document.createElement('p');
    detail.className = 'program-detail-desc';
    detail.textContent = program.detail;
    
    content.appendChild(tag);
    content.appendChild(title);
    content.appendChild(shortDesc);
    content.appendChild(detail);
    
    card.appendChild(img);
    card.appendChild(content);
    
    return card;
}

/**
 * about.html 페이지 렌더링
 * [비전공자 수정 포인트]
 * 창업지원팀 소개 내용을 수정하려면 content.json의 "about" 섹션을 수정하세요.
 */
function renderAboutPage() {
    if (!contentData.about) return;
    
    const aboutTitle = document.getElementById('aboutTitle');
    const aboutMission = document.getElementById('aboutMission');
    const aboutVision = document.getElementById('aboutVision');
    const aboutRoles = document.getElementById('aboutRoles');
    const aboutNotice = document.getElementById('aboutNotice');
    
    if (aboutTitle) aboutTitle.textContent = contentData.about.title;
    if (aboutMission) aboutMission.textContent = contentData.about.mission;
    if (aboutVision) aboutVision.textContent = contentData.about.vision;
    
    if (aboutRoles && contentData.about.roles) {
        aboutRoles.innerHTML = '';
        contentData.about.roles.forEach(role => {
            const li = document.createElement('li');
            li.textContent = role;
            aboutRoles.appendChild(li);
        });
    }
    
    if (aboutNotice) {
        aboutNotice.innerHTML = `<p>${contentData.about.notice}</p>`;
    }
}

/**
 * contact.html 페이지 렌더링
 * [비전공자 수정 포인트]
 * 연락처 정보를 수정하려면 content.json의 "contact" 섹션을 수정하세요.
 * 지도를 추가하려면 "mapEmbed" 필드에 구글맵 또는 카카오맵 iframe 코드를 넣으세요.
 */
function renderContactPage() {
    if (!contentData.contact) return;
    
    const contactTitle = document.getElementById('contactTitle');
    const contactDesc = document.getElementById('contactDesc');
    const contactEmail = document.getElementById('contactEmail');
    const contactPhone = document.getElementById('contactPhone');
    const contactLocation = document.getElementById('contactLocation');
    const contactMap = document.getElementById('contactMap');
    
    if (contactTitle) contactTitle.textContent = contentData.contact.title;
    if (contactDesc) contactDesc.textContent = contentData.contact.description;
    if (contactEmail) contactEmail.textContent = contentData.contact.email;
    if (contactPhone) contactPhone.textContent = contentData.contact.phone;
    if (contactLocation) contactLocation.textContent = contentData.contact.location;
    
    // 지도 삽입
    // [비전공자 수정 포인트]
    // content.json의 mapEmbed에 구글맵이나 카카오맵 iframe HTML을 넣으면 여기에 표시됩니다.
    if (contactMap && contentData.contact.mapEmbed) {
        contactMap.innerHTML = contentData.contact.mapEmbed;
    }
}

/**
 * 모바일 메뉴 토글
 */
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // 메뉴 항목 클릭 시 메뉴 닫기
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }
}
```

## 7. config/content.json
```json
{
  "site": {
    "title": "배재대학교 창업지원팀",
    "logoText": "배재대 창업지원팀"
  },
  "nav": [
    { "label": "홈", "href": "index.html" },
    { "label": "지원 프로그램", "href": "programs.html" },
    { "label": "창업지원팀 소개", "href": "about.html" },
    { "label": "문의하기", "href": "contact.html" }
  ],
  "landing": {
    "heroTitle": "아이디어를 현실로, 배재대 창업지원팀",
    "heroSubtitle": "창업을 처음 시작하는 배재대학교 재학생을 위해, 아이디어 발굴부터 사업화까지 전 과정을 함께합니다.",
    "heroButtonText": "창업지원 프로그램 한눈에 보기",
    "heroButtonLink": "programs.html",
    "heroImage": "assets/img/IMG_01.jpg"
  },
  "sections": {
    "briefIntro": {
      "title": "배재대 창업지원팀은 무엇을 하나요?",
      "description": "배재대학교 창업지원팀은 재학생들이 창업을 안전하게 시도해볼 수 있도록, 창업동아리, 창업 마일리지 제도, 초기창업지원금, 창업 특강 등 다양한 프로그램을 운영하며 아이디어 단계부터 실제 사업 운영까지 전 과정을 지원합니다."
    },
    "fourProgramsSummary": {
      "title": "4가지 핵심 지원제도",
      "items": [
        {
          "name": "창업동아리",
          "shortDesc": "아이디어를 팀 단위로 실행해보는 교내 창업동아리",
          "image": "assets/img/IMG_02.jpg"
        },
        {
          "name": "창업 마일리지 제도",
          "shortDesc": "창업 관련 활동에 점수를 부여하고, 순위에 따라 장학금·시상",
          "image": "assets/img/IMG_03.jpg"
        },
        {
          "name": "초기창업지원금",
          "shortDesc": "실제 사업자등록을 한 학생에게 1회 최대 100만원 지원",
          "image": "assets/img/IMG_04.jpg"
        },
        {
          "name": "창업 특강·캠프",
          "shortDesc": "시기에 따라 달라지는 실전형 창업 특강과 캠프",
          "image": "assets/img/IMG_05.jpg"
        }
      ]
    }
  },
  "programs": [
    {
      "id": "club",
      "name": "창업동아리",
      "tag": "창업동아리",
      "image": "assets/img/IMG_02.jpg",
      "shortDesc": "창업 아이디어를 가진 학생들이 팀을 꾸려 실제로 실행해보는 교내 창업동아리 프로그램입니다.",
      "detail": "창업동아리 프로그램은 아이디어 단계의 학생들이 팀을 구성하여 시장조사, 아이템 구체화, 시제품 제작, 발표(Pitching)까지 경험해볼 수 있도록 지원하는 제도입니다. 팀별로 최대 100만원까지 창업활동에 필요한 항목(재료비, 시제품 제작비, 홍보비 등)을 지원하며, 활동 종료 후 우수 동아리를 선발하여 상장과 추가 인센티브(상금 등)를 제공합니다."
    },
    {
      "id": "mileage",
      "name": "창업 마일리지 제도",
      "tag": "창업 마일리지",
      "image": "assets/img/IMG_03.jpg",
      "shortDesc": "창업 활동에 참여할수록 점수가 쌓이고, 누적 점수에 따라 시상과 지원을 제공하는 제도입니다.",
      "detail": "창업 마일리지 제도는 학생들의 지속적인 창업 활동 참여를 장려하기 위한 포인트·랭킹 제도입니다. 교외 창업경진대회, 외부 특강·세미나·캠프 참여 시 이동비 및 활동비 등을 지원하며, 교내에서 진행되는 창업 특강, 창업캠프, 경진대회, 창업동아리 활동도 모두 마일리지 점수로 환산됩니다. 연말에는 마일리지 점수를 기준으로 1등부터 15등까지 순위를 산정하여, 장학금 또는 상금과 함께 시상함으로써 학생들의 도전과 성취를 인정합니다."
    },
    {
      "id": "seedFunding",
      "name": "초기창업지원금",
      "tag": "초기창업지원금",
      "image": "assets/img/IMG_04.jpg",
      "shortDesc": "실제로 사업자등록을 한 학생창업자에게 초기 사업 운영에 필요한 자금을 지원합니다.",
      "detail": "초기창업지원금은 배재대학교에 재학 중인 학생이 실제로 사업자등록을 하고 창업을 시작했을 때, 초기 운영에 필요한 비용을 지원하는 제도입니다. 재학 중 1인당 한 번만 신청할 수 있으며, 사업자등록증을 통해 실제 창업 사실을 증빙해야 합니다. 승인된 학생에게는 최대 100만원 범위 내에서 시제품 제작비, 마케팅비, 홍보물 제작, 플랫폼 등록비 등 창업 활동에 직접 필요한 항목을 지원합니다."
    },
    {
      "id": "lecture",
      "name": "창업 특강·캠프",
      "tag": "창업 특강/캠프",
      "image": "assets/img/IMG_05.jpg",
      "shortDesc": "시기에 따라 달라지는 다양한 주제의 창업 특강과 캠프 프로그램입니다.",
      "detail": "창업 특강·캠프는 학기별·연도별로 구성되는 다양한 주제의 교육 프로그램입니다. 창업 기초 이해, 아이템 발굴 방법, 팀 빌딩, 비즈니스 모델 설계, 마케팅/브랜딩, 지식재산권, 회계·세무, 피칭 스킬 등 실제 창업에 필요한 내용을 다룹니다. 단기 집중형 캠프, 실습형 워크숍, 전문가 초청 특강 등 형태로 운영되며, 일부 프로그램은 창업 마일리지 점수와도 연계됩니다."
    }
  ],
  "about": {
    "title": "배재대학교 창업지원팀 소개",
    "mission": "배재대학교 재학생이 실패를 두려워하지 않고 자유롭게 창업에 도전할 수 있도록, 안전한 실험장과 실질적인 지원을 제공하는 것이 우리의 사명입니다.",
    "vision": "지역과 함께 성장하는 청년 창업 생태계의 허브",
    "roles": [
      "창업 아이디어 발굴·육성을 위한 교육 및 프로그램 운영",
      "창업동아리, 경진대회 등을 통한 실전형 경험 제공",
      "초기창업지원금, 마일리지 제도를 통한 재정적 지원",
      "교내외 멘토·전문가·선배 창업가와의 네트워크 연결"
    ],
    "notice": "※ 실제 조직 구성, 담당자 이름 및 세부 연락처 등은 이후 업데이트 예정입니다."
  },
  "contact": {
    "title": "문의 및 오시는 길",
    "description": "배재대학교 창업지원팀 프로그램에 관심이 있다면 언제든지 문의해주세요.",
    "email": "startup@pcu.ac.kr",
    "phone": "042-000-0000",
    "location": "배재대학교 캠퍼스 내 ○○관 ○층 창업지원팀 사무실",
    "mapEmbed": "<!-- 지도 iframe 또는 지도 이미지가 들어갈 자리입니다. -->"
  },
  "footer": {
    "copyright": "© 배재대학교 창업지원팀 All rights reserved.",
    "links": [
      { "label": "배재대학교 홈페이지", "href": "https://www.pcu.ac.kr" }
    ]
  }
}
```

---

## 사용 방법 안내

### 1. 파일 배치
위의 파일들을 다음과 같은 구조로 배치하세요:
your-repository/
├── index.html
├── programs.html
├── about.html
├── contact.html
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── img/
│       ├── IMG_01.jpg
│       ├── IMG_02.jpg
│       ├── IMG_03.jpg
│       ├── IMG_04.jpg
│       └── IMG_05.jpg
└── config/
└── content.json
### 2. 이미지 추가
`assets/img/` 폴더에 IMG_01.jpg ~ IMG_05.jpg 이미지를 추가하세요.
- IMG_01: 메인 히어로 이미지
- IMG_02: 창업동아리 이미지
- IMG_03: 창업 마일리지 이미지
- IMG_04: 초기창업지원금 이미지
- IMG_05: 창업 특강·캠프 이미지

### 3. 비전공자 수정 가이드

**텍스트나 이미지 경로를 변경하려면:**
- `config/content.json` 파일만 수정하면 됩니다.
- HTML이나 CSS, JS 파일을 건드릴 필요가 없습니다.

**색상을 변경하려면:**
- `assets/css/style.css` 파일 상단의 :root 섹션에서 색상 코드를 변경하세요.
지도를 추가하려면:

구글맵이나 카카오맵에서 iframe 코드를 복사해서
config/content.json의 contact.mapEmbed 필드에 붙여넣으세요.

4. GitHub Pages 배포

GitHub 저장소를 생성합니다.
위 파일들을 저장소에 업로드합니다.
Settings > Pages에서 배포 브랜치를 설정합니다.
https://username.github.io/repository-name/ 으로 접속하면 사이트가 보입니다.

모든 코드가 완성되었습니다. 필요한 부분이 있으면 말씀해주세요!
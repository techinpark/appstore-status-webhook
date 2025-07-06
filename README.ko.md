# 🍎 App Store Connect 상태 웹훅

[![Vercel로 배포하기](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftechinpark%2Fappstore-status-webhook)

*[🇺🇸 English README](README.md)*

App Store Connect 웹훅 이벤트를 받아서 Slack, Discord로 아름다운 다국어 알림을 전송하는 서버리스 웹훅 프록시입니다.

## ✨ 주요 기능

- 🔔 **다중 플랫폼 알림**: Slack, Discord 지원
- 🌐 **다국어 지원**: 한국어와 영어 완전 지원
- 🔒 **보안**: Apple 서명 검증 기능
- 🎨 **아름다운 포맷팅**: 상태별 색상과 이모지가 포함된 리치 임베드
- ⚡ **서버리스**: Vercel에 즉시 배포
- 📱 **App Store 특화**: 모든 App Store Connect 웹훅 이벤트 처리

## 🚀 빠른 시작

### 1. Vercel에 배포

[![Vercel로 배포하기](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftechinpark%2Fappstore-status-webhook)

또는 수동으로 클론하여 배포하기:

```bash
git clone https://github.com/techinpark/appstore-status-webhook.git
cd appstore-status-webhook
npm install
vercel --prod
```

### 2. 환경 변수 설정

Vercel 프로젝트 설정에서 다음 환경 변수를 설정하세요:

```bash
# 필수: 최소 하나의 웹훅 URL
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK

# 선택사항: Apple 서명 검증
SHARED_SECRET=your_shared_secret_here

# 선택사항: App Store Connect API (향상된 앱 정보를 위함)
ENABLE_APP_STORE_API=true
APP_STORE_CONNECT_KEY_ID=your_key_id
APP_STORE_CONNECT_ISSUER_ID=your_issuer_id
APP_STORE_CONNECT_PRIVATE_KEY_PATH=/path/to/your/private/key.p8
# 또는 개인 키 내용을 직접 사용:
# APP_STORE_CONNECT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_CONTENT\n-----END PRIVATE KEY-----"

# 선택사항: 커스터마이징
APP_STORE_URL=https://apps.apple.com/app/your-app/id123456789  # API가 비활성화된 경우 폴백으로 사용
TIMEZONE=Asia/Seoul
LANGUAGE=ko  # en (영어), ko (한국어), ja (일본어), zh (중국어), es (스페인어), fr (프랑스어), de (독일어)
```

### 3. App Store Connect 설정

1. **App Store Connect** → **사용자 및 액세스** → **웹훅**으로 이동
2. 배포된 URL로 새 웹훅 생성: `https://your-app.vercel.app/api/webhook`
3. 받고 싶은 이벤트 선택
4. 웹훅 저장

## 📊 지원되는 이벤트

| 이벤트 | 설명 | 플랫폼 |
|-------|------|--------|
| `appStoreVersionAppVersionStateUpdated` | 앱 버전 상태 변경 | ✅ 모든 플랫폼 |
| `webhookPingCreated` | 웹훅 테스트 핑 | ✅ 모든 플랫폼 |
| 커스텀 이벤트 | JSON 페이로드와 함께 처리되지 않은 이벤트 | ✅ 모든 플랫폼 |

## 🎨 알림 예시

### Slack
```
🍏 내 앱 이름
────────────────────────────────────────
✅ 현재 상태: 판매 가능
📤 이전 상태: Apple 출시 대기 중
📱 앱 이름: 내 앱 이름
🔢 버전: 1.2.3
📦 번들 ID: com.yourcompany.yourapp
```

### Discord
상태별 색상, 타임스탬프, 클릭 가능한 App Store 링크가 포함된 리치 임베드

## 🔗 App Store Connect API 연동

### 향상된 앱 정보

App Store Connect API 연동을 활성화하면 알림에서 풍부한 앱 정보를 얻을 수 있습니다:

- **앱 이름**: App Store Connect에서 가져온 실제 앱 이름
- **버전 번호**: 현재 버전 문자열
- **번들 ID**: 앱 번들 식별자
- **동적 App Store 링크**: 자동으로 생성되는 앱 링크
- **App Store 상태**: 현재 앱 상태

### App Store Connect API 설정하기

1. **API 키 생성**:
   - [App Store Connect](https://appstoreconnect.apple.com/)로 이동
   - **사용자 및 액세스** → **통합** → **App Store Connect API**로 이동
   - **API 키 생성** 클릭
   - **액세스**: **개발자** (최소 필요 권한)로 설정
   - `.p8` 개인 키 파일 다운로드

2. **인증 정보 가져오기**:
   - **키 ID**: API 키 세부 정보에서 확인
   - **발급자 ID**: API 키 섹션 헤더에서 확인
   - **개인 키**: 다운로드한 `.p8` 파일 내용

3. **환경 변수 설정**:
   ```bash
   ENABLE_APP_STORE_API=true
   APP_STORE_CONNECT_KEY_ID=ABC123DEFG
   APP_STORE_CONNECT_ISSUER_ID=12345678-1234-1234-1234-123456789012
   APP_STORE_CONNECT_PRIVATE_KEY_PATH=/path/to/AuthKey_ABC123DEFG.p8
   ```

   **Vercel 배포의 경우**, 개인 키 내용을 직접 사용하세요:
   ```bash
   APP_STORE_CONNECT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
   MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
   -----END PRIVATE KEY-----"
   ```

### API 연동의 장점

- **자동 App Store 링크**: `APP_STORE_URL`을 수동으로 설정할 필요 없음
- **풍부한 알림**: 알림에 앱 이름, 버전, 번들 ID 포함
- **다중 앱 지원**: 여러 앱에 대해 자동으로 작동
- **실시간 데이터**: Apple에서 항상 최신 정보 제공

### 문제 해결

- API 호출이 실패하면 알림이 기본 정보로 폴백됩니다
- 인증 오류는 로그를 확인하세요
- API 키가 **개발자** 액세스 수준인지 확인하세요
- 개인 키 형식을 확인하세요 (`-----BEGIN PRIVATE KEY-----` 포함)

## 🔧 로컬 개발

```bash
# 저장소 클론
git clone https://github.com/techinpark/appstore-status-webhook.git
cd appstore-status-webhook

# 의존성 설치
npm install

# 환경 변수 복사
cp env.example .env.local

# .env.local 파일을 웹훅 URL로 편집
# 개발 서버 시작
npm run start

# 웹훅 테스트 (다른 터미널에서)
npm run test
```

## 🌐 다국어 지원

프로젝트는 다음 언어를 지원합니다:

- **영어** (`en`): 기본 언어
- **한국어** (`ko`): 완전한 한국어 지원
- **일본어** (`ja`): 완전한 일본어 지원
- **중국어** (`zh`): 완전한 중국어 지원
- **스페인어** (`es`): 완전한 스페인어 지원
- **프랑스어** (`fr`): 완전한 프랑스어 지원
- **독일어** (`de`): 완전한 독일어 지원

원하는 언어로 `LANGUAGE` 환경 변수를 설정하세요.

## 🔒 보안

### Apple 서명 검증

`SHARED_SECRET` 환경 변수를 설정하여 서명 검증을 활성화하세요:

```bash
SHARED_SECRET=appstore_connect에서_받은_shared_secret
```

이렇게 하면 Apple에서 보낸 진짜 웹훅만 처리됩니다.

## 🎯 API 참조

### `POST /api/webhook`

App Store Connect 웹훅 이벤트를 받습니다.

**헤더:**
- `Content-Type: application/json`
- `X-Apple-Signature: sha256=...` (서명 검증이 활성화된 경우)

**응답:**
```json
{
  "message": "OK"
}
```

**오류 응답:**
- `405 Method Not Allowed` - POST가 아닌 요청
- `401 Unauthorized` - 잘못된 서명
- `500 Internal Server Error` - 처리 오류

## 📁 프로젝트 구조

```
appstore-status-webhook/
├── api/
│   └── webhook.ts              # 메인 웹훅 핸들러
├── lib/
│   ├── builders/               # 메시지 빌더
│   │   ├── discord.ts
│   │   └── slack.ts
│   ├── constants/              # 설정 상수
│   │   ├── config.ts
│   │   └── status.ts
│   ├── locales/               # 다국어 파일
│   │   ├── en.json
│   │   └── ko.json
│   ├── notifiers/             # 플랫폼 알림 발송기
│   │   ├── discord.ts
│   │   └── slack.ts
│   ├── types/                 # TypeScript 타입
│   │   └── index.ts
│   └── utils/                 # 유틸리티 함수
│       ├── color.ts
│       ├── locale.ts
│       ├── signature.ts
│       ├── status.ts
│       └── timestamp.ts
├── env.example                # 환경 변수 템플릿
├── package.json
├── tsconfig.json
└── vercel.json               # Vercel 설정
```

## 🤝 기여하기

기여를 환영합니다! 언제든 Pull Request를 제출해주세요.

1. 저장소를 포크하세요
2. 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 열어주세요

## 📜 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사의 말

- App Store Connect 개발자 커뮤니티를 위해 제작
- 더 나은 웹훅 알림의 필요성에서 영감을 받음
- 모든 기여자분들께 특별한 감사를 드립니다

---

**도움이 필요하신가요?** [이슈를 열어주세요](https://github.com/techinpark/appstore-status-webhook/issues) 또는 [토론을 시작하세요](https://github.com/techinpark/appstore-status-webhook/discussions). 
# Google Play 등록 가이드

최종 정리일: 2026-04-23

## 1. 지금 바로 쓸 수 있는 파일

- 앱 번들 경로: `app/build/outputs/bundle/release/app-release.aab`
- 앱 아이콘: `store-assets/icon/app-icon-play-512.png`
- 피처 그래픽: `store-assets/submission/promo/feature-graphic-1024x500.png`
- 스크린샷 1: `store-assets/submission/screenshots-phone/01-setup-screen.jpg`
- 스크린샷 2: `store-assets/submission/screenshots-phone/02-role-reveal-screen.jpg`
- 스토어 문구: `store-assets/submission/play-store-copy-ko.md`
- 개인정보처리방침 초안: `store-assets/submission/privacy-policy-ko.html`

## 2. 현재 앱 기본 정보

- 패키지명: `com.fogbound.mafia`
- 앱 이름 리소스: `마피아게임`
- versionCode: `1`
- versionName: `1.0`
- minSdk: `24`
- targetSdk: `36`

## 3. 등록 전에 꼭 확인할 점

- 현재 생성된 `app-release.aab`는 **서명되지 않은 번들**입니다.
- Google Play 업로드용 AAB는 **업로드 키로 서명**되어야 합니다.
- 지금 앱에는 **AdMob 테스트 광고 ID**가 들어 있습니다. 실제 배포 전에는 본인 AdMob 실사용 ID로 교체해야 합니다.
- 개인정보처리방침은 로컬 파일이 아니라 **공개 URL**로 올려야 Play Console에 입력할 수 있습니다.

## 4. 추천 등록값

아래는 현재 앱 구조를 기준으로 한 추천값입니다.

- 앱/게임 구분: `게임`
- 유료/무료: `무료`
- 광고 포함 여부: `예`
- 카테고리: `보드` 또는 `캐주얼`
- 연락처 이메일: 실제 운영 이메일 입력

추정 기준입니다.

- 타깃 연령대: `16-17`, `18+` 권장
- 13세 미만 아동용 앱 아님

## 5. Data safety 입력 가이드

이 앱은 자체 서버로 플레이어 정보를 보내지 않지만, AdMob SDK 기준으로 아래 항목은 검토하는 편이 안전합니다.

- 데이터 수집/공유 있음: `예`
- 수집 또는 공유 주체: 광고 SDK 포함 전체 앱 기준
- 데이터 유형 후보:
  - `Device or other IDs`
  - `Diagnostics`
  - `App interactions`
  - `Approximate location`은 콘솔 문항을 보고 최종 판단
- 사용 목적 후보:
  - `Advertising or marketing`
  - `Analytics`
  - `Fraud prevention, security, and compliance`
- 전송 중 암호화: `예`
- 데이터 삭제 요청: 앱 자체 계정/서버가 없으므로 콘솔 질문 문구를 보고 최종 선택

중요:

- 위 항목은 **현재 코드와 AdMob 공식 문서를 바탕으로 한 추천안**입니다.
- Play Console에는 실제 앱 동작과 SDK 설정에 맞게 최종 입력해야 합니다.

## 6. Play Console 등록 순서

1. Play Console에서 새 앱 생성
2. 앱 이름, 기본 언어, 앱/게임 여부, 무료 여부 입력
3. 스토어 문구와 그래픽 자산 업로드
4. 개인정보처리방침 공개 URL 입력
5. Ads 선언, Target audience, Content rating, Data safety 작성
6. 내부 테스트 또는 비공개 테스트 트랙 생성
7. 서명된 AAB 업로드
8. 새 개인 계정이면 테스트 요건 충족 후 프로덕션 접근 신청

## 7. 새 개인 계정이면 추가로 필요한 것

개인 개발자 계정을 2023-11-13 이후 만들었다면, 프로덕션 공개 전 아래 요건이 있을 수 있습니다.

- 12명 이상의 비공개 테스트 참여자
- 최소 14일 연속 테스트 유지
- Play Console 모바일 앱을 통한 기기 인증

## 8. 서명 준비

코드 쪽은 `keystore.properties`가 있으면 release 서명을 읽도록 맞춰 두었습니다.

- 예시 파일: `keystore.properties.example`
- 실제 사용 시:
  1. `keystore.properties.example`를 `keystore.properties`로 복사
  2. 업로드 키스토어 경로와 비밀번호 입력
  3. release 번들 다시 빌드

## 9. 남아 있는 실제 작업

- 실사용 AdMob ID로 교체
- 공개 가능한 개인정보처리방침 URL 배포
- 업로드 키 생성 및 release 서명
- Play Console에서 계정 상태에 맞는 테스트/검수 절차 진행

/**
 * 가상 피팅 데이터 어댑터의 진입점.
 *
 * 정식(로그인 유저) 구현을 노출한다: 전신 사진은 profiles.body_photo_url,
 * 옷은 clothes 테이블 + 온보딩에서 등록한 사진. 베타 샘플 구현(beta.ts)은
 * 참고용으로 남겨 둔다(여기 export만 바꾸면 다시 전환 가능).
 */
export {
  getCurrentUserId,
  getUserPhotoSignedUrl,
  getUserPhotoBase64,
  getWardrobe,
  getClothBase64,
} from "@/lib/fitting/real";

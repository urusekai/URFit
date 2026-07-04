/**
 * 가상 피팅 데이터 어댑터의 진입점.
 *
 * 현재는 베타 구현(Storage + 고정 유저)을 그대로 노출한다.
 * 정식 전환 시 이 파일에서 export 대상을 real 구현으로 바꾸면
 * (또는 런타임 플래그로 분기하면) 나머지 코드는 손대지 않아도 된다.
 */
export {
  BETA_USER_ID,
  getCurrentUserId,
  getUserPhotoSignedUrl,
  getUserPhotoBase64,
  getWardrobe,
  getClothBase64,
} from "@/lib/fitting/beta";

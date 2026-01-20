export interface Product {
  id: number;
  title: string;
  price: number;
  image: string; // 📍 이름을 image로 통일!
  createdAt: string;
  location: string;
}

export const MOCK_PRODUCTS: Product[] = [
  // IT/디지털
  { id: 1, title: "애플워치 SE2 44mm GPS 미개봉", price: 320000, image: "https://loremflickr.com/400/400/applewatch", createdAt: "방금 전", location: "서울 강남구" },
  { id: 2, title: "아이폰 15 프로 128GB 티타늄", price: 1150000, image: "https://loremflickr.com/400/400/iphone", createdAt: "5분 전", location: "경기 수원시" },
  { id: 3, title: "소니 WH-1000XM5 헤드셋", price: 380000, image: "https://loremflickr.com/400/400/headphone", createdAt: "12분 전", location: "서울 마포구" },
  { id: 4, title: "아이패드 에어 5세대 64GB", price: 620000, image: "https://loremflickr.com/400/400/ipad", createdAt: "20분 전", location: "대구 중구" },
  { id: 5, title: "로지텍 MX Master 3S 마우스", price: 95000, image: "https://loremflickr.com/400/400/mouse", createdAt: "45분 전", location: "인천 연수구" },
  { id: 6, title: "닌텐도 스위치 OLED 화이트", price: 340000, image: "https://loremflickr.com/400/400/nintendo", createdAt: "1시간 전", location: "부산 해운대구" },
  { id: 7, title: "맥북 에어 M2 13인치 램 16G", price: 1450000, image: "https://loremflickr.com/400/400/macbook", createdAt: "2시간 전", location: "대전 서구" },
  { id: 8, title: "에어팟 프로 2세대 C타입", price: 240000, image: "https://loremflickr.com/400/400/airpods", createdAt: "3시간 전", location: "서울 송파구" },
  { id: 9, title: "다이슨 에어랩 멀티 스타일러", price: 480000, image: "https://loremflickr.com/400/400/dyson", createdAt: "5시간 전", location: "경기 용인시" },
  { id: 10, title: "플레이스테이션 5 디스크 에디션", price: 450000, image: "https://loremflickr.com/400/400/ps5", createdAt: "7시간 전", location: "광주 북구" },

  // 패션/의류
  { id: 11, title: "나이키 덩크 로우 범고래 270", price: 125000, image: "https://loremflickr.com/400/400/sneakers", createdAt: "10분 전", location: "서울 성동구" },
  { id: 12, title: "아크테릭스 헬리아드 15 백팩", price: 190000, image: "https://loremflickr.com/400/400/backpack", createdAt: "30분 전", location: "서울 노원구" },
  { id: 13, title: "스톤아일랜드 와펜 맨투맨 L", price: 280000, image: "https://loremflickr.com/400/400/sweatshirt", createdAt: "1시간 전", location: "경기 부천시" },
  { id: 14, title: "폴로 랄프로렌 케이블 니트 M", price: 85000, image: "https://loremflickr.com/400/400/knit", createdAt: "2시간 전", location: "충남 천안시" },
  { id: 15, title: "파타고니아 레트로X 자켓 L", price: 180000, image: "https://loremflickr.com/400/400/jacket", createdAt: "4시간 전", location: "전북 전주시" },
  { id: 16, title: "가니 로고 비니 핑크 미개봉", price: 55000, image: "https://loremflickr.com/400/400/beanie", createdAt: "6시간 전", location: "서울 은평구" },
  { id: 17, title: "살로몬 XT-6 화이트 265", price: 210000, image: "https://loremflickr.com/400/400/salomon", createdAt: "8시간 전", location: "경기 안양시" },
  { id: 18, title: "코스 퀼티드 미니백 구름백", price: 60000, image: "https://loremflickr.com/400/400/bag", createdAt: "12시간 전", location: "울산 남구" },
  { id: 19, title: "바버 인터내셔널 자켓 40", price: 230000, image: "https://loremflickr.com/400/400/barbour", createdAt: "어제", location: "서울 용산구" },
  { id: 20, title: "메종 키츠네 가디건 네이비 L", price: 150000, image: "https://loremflickr.com/400/400/cardigan", createdAt: "어제", location: "경기 고양시" },

  // 카메라/취미/악기
  { id: 21, title: "후지필름 X100V 실버 풀박스", price: 1850000, image: "https://loremflickr.com/400/400/camera", createdAt: "5분 전", location: "서울 마포구" },
  { id: 22, title: "마샬 엠버튼 2 블루투스 스피커", price: 140000, image: "https://loremflickr.com/400/400/speaker", createdAt: "25분 전", location: "경기 화성시" },
  { id: 23, title: "레고 스타워즈 밀레니엄 팔콘", price: 250000, image: "https://loremflickr.com/400/400/lego", createdAt: "1시간 전", location: "강원 원주시" },
  { id: 24, title: "캐논 EOS R6 바디 급매", price: 1950000, image: "https://loremflickr.com/400/400/canon", createdAt: "3시간 전", location: "서울 서대문구" },
  { id: 25, title: "펜더 스트라토캐스터 기타", price: 1200000, image: "https://loremflickr.com/400/400/guitar", createdAt: "5시간 전", location: "서울 광진구" },
  { id: 26, title: "코닥 펀세이버 일회용 카메라", price: 18000, image: "https://loremflickr.com/400/400/film", createdAt: "10시간 전", location: "경기 파주시" },
  { id: 27, title: "보드게임 스플렌더 확장 포함", price: 35000, image: "https://loremflickr.com/400/400/boardgame", createdAt: "어제", location: "충북 청주시" },
  { id: 28, title: "헬리녹스 체어원 블랙 2개", price: 180000, image: "https://loremflickr.com/400/400/camping", createdAt: "어제", location: "경남 김해시" },
  { id: 29, title: "야마하 P-125 디지털 피아노", price: 450000, image: "https://loremflickr.com/400/400/piano", createdAt: "2일 전", location: "서울 동대문구" },
  { id: 30, title: "포켓몬 카드 뮤츠 VSTAR SAR", price: 120000, image: "https://loremflickr.com/400/400/card", createdAt: "3일 전", location: "부산 수영구" },

  // 기타 생활/스포츠/잡화
  { id: 31, title: "브롬톤 M6R 블랙 에디션", price: 2400000, image: "https://loremflickr.com/400/400/bicycle", createdAt: "1시간 전", location: "서울 강동구" },
  { id: 32, title: "발뮤다 더 토스터 화이트", price: 190000, image: "https://loremflickr.com/400/400/toaster", createdAt: "2시간 전", location: "경기 남양주시" },
  { id: 33, title: "네스프레소 버츄오 플러스", price: 110000, image: "https://loremflickr.com/400/400/coffee", createdAt: "4시간 전", location: "인천 부평구" },
  { id: 34, title: "몽블랑 사토리얼 카드지갑", price: 150000, image: "https://loremflickr.com/400/400/wallet", createdAt: "6시간 전", location: "서울 관악구" },
  { id: 35, title: "프라이탁 하와이 파이브 오", price: 220000, image: "https://loremflickr.com/400/400/freitag", createdAt: "8시간 전", location: "서울 동작구" },
  { id: 36, title: "루이스폴센 PH5 조명", price: 750000, image: "https://loremflickr.com/400/400/lamp", createdAt: "10시간 전", location: "제주 제주시" },
  { id: 37, title: "테일러메이드 스텔스 드라이버", price: 320000, image: "https://loremflickr.com/400/400/golf", createdAt: "어제", location: "경북 포항시" },
  { id: 38, title: "요가매트 룰루레몬 5mm", price: 70000, image: "https://loremflickr.com/400/400/yoga", createdAt: "어제", location: "서울 서초구" },
  { id: 39, title: "르 라보 상탈 33 50ml", price: 180000, image: "https://loremflickr.com/400/400/perfume", createdAt: "2일 전", location: "경기 김포시" },
  { id: 40, title: "이솝 레저렉션 핸드밤 75ml", price: 25000, image: "https://loremflickr.com/400/400/aesop", createdAt: "2일 전", location: "서울 성북구" },
  { id: 41, title: "딥티크 도손 오드퍼퓸", price: 140000, image: "https://loremflickr.com/400/400/diptyque", createdAt: "3일 전", location: "경기 성남시" },
  { id: 42, title: "요시다 포터 탱커 숄더백", price: 280000, image: "https://loremflickr.com/400/400/porter", createdAt: "3일 전", location: "서울 강남구" },
  { id: 43, title: "아디다스 삼바 비건 화이트", price: 110000, image: "https://loremflickr.com/400/400/adidas", createdAt: "4일 전", location: "서울 양천구" },
  { id: 44, title: "올리브영 기프트카드 5만원권", price: 46000, image: "https://loremflickr.com/400/400/giftcard", createdAt: "4일 전", location: "온라인거래" },
  { id: 45, title: "스타벅스 에코백 미사용", price: 10000, image: "https://loremflickr.com/400/400/starbucks", createdAt: "5일 전", location: "서울 금천구" },
  { id: 46, title: "킨토 데이오프 텀블러 500ml", price: 30000, image: "https://loremflickr.com/400/400/tumbler", createdAt: "5일 전", location: "경기 시흥시" },
  { id: 47, title: "러쉬 더티 스프레이 200ml", price: 35000, image: "https://loremflickr.com/400/400/lush", createdAt: "6일 전", location: "서울 중랑구" },
  { id: 48, title: "크리드 어벤투스 100ml", price: 350000, image: "https://loremflickr.com/400/400/creed", createdAt: "6일 전", location: "서울 도봉구" },
  { id: 49, title: "우영미 백로고 반팔 티셔츠", price: 190000, image: "https://loremflickr.com/400/400/tshirt", createdAt: "일주일 전", location: "인천 계양구" },
  { id: 50, title: "메종 마르지엘라 레플리카 향수", price: 95000, image: "https://loremflickr.com/400/400/replica", createdAt: "일주일 전", location: "서울 구로구" }
];
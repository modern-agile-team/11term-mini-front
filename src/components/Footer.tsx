const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 pt-10 pb-20">
      <div className="max-w-[1024px] mx-auto px-4">
        
        {/* 1. 상단 정책 링크 */}
        <div className="flex gap-6 text-[14px] text-gray-800 mb-10 pb-6 border-b border-gray-100">
          <button className="hover:underline">회사소개</button>
          <button className="hover:underline">이용약관</button>
          <button className="hover:underline">운영정책</button>
          <button className="font-bold hover:underline">개인정보처리방침</button>
          <button className="hover:underline">청소년보호정책</button>
          <button className="hover:underline">광고제휴</button>
        </div>

        {/* 2. 중앙 정보 영역 */}
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10 text-[13px] text-gray-500 leading-6">
          
          {/* 왼쪽: 사업자 정보 */}
          <div className="flex-1">
            <h3 className="font-bold mb-2 text-gray-800">번개장터(주) 사업자정보</h3>
            <p>대표이사 : 이재혁, 서준호  |  개인정보보호책임자 : 임동영</p>
            <p>사업자등록번호 : 111-11-11111  |  통신판매업신고 : 2002-서울노원-1114</p>
            <p>호스팅서비스 제공자 : Amazon Web Services (AWS)</p>
            <p>EMAIL : lee3882jh@naver.com  |  FAX : 00-0000-0000</p>
            <p>주소 : 서울특별시 노원구 인덕대학교 </p>
            <button className="underline mt-2">사업자정보 확인</button>
            
            <div className="mt-6">
              <h3 className="font-bold mb-1 text-gray-800">번개장터(주)센터필드점</h3>
              <p>서울특별시 강남구 테헤란로 231, 쇼핑몰동 1층 W124호(역삼동(역삼동, 센터필드))</p>
            </div>
          </div>

          {/* 오른쪽: 고객센터 & 보증 안내 */}
          <div className="w-[300px]">
            <h3 className="font-bold mb-2 text-gray-800 text-[15px]">고객센터 〉</h3>
            <p className="text-[24px] font-bold text-gray-800 mb-1">1670-2910</p>
            <p>운영시간 9시 - 18시 (주말/공휴일 휴무, 점심시간 12시 - 13시)</p>
            <div className="flex gap-3 mt-2 underline">
              <button>공지사항</button>
              <button>1:1 문의하기</button>
              <button>자주 묻는 질문</button>
            </div>

            <div className="mt-8">
              <h3 className="font-bold mb-2 text-gray-800">우리은행 채무지급보증 안내</h3>
              <p>번개장터(주)는 회사가 직접 판매하는 상품에 한하여, 고객님의 현금 결제 금액에 대해 우리은행과 채무지급보증 계약을 체결하여 안전거래를 보장하고 있습니다.</p>
              <button className="underline mt-1">서비스 가입사실 확인</button>
              <p className="mt-4 text-[11px]">© Bungaejangter. Inc All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* 3. 하단 법적 고지 및 ISMS */}
        <div className="flex flex-col md:flex-row gap-6 pt-8 border-t border-gray-100 items-start">
          <div className="flex gap-4 items-center flex-shrink-0">
             <div className="p-2 border border-gray-200 text-[10px] text-center leading-3 font-bold">
               ISMS
             </div>
             <p className="text-[11px] text-gray-400">
               [인증범위] 번개장터 중고거래 플랫폼 서비스 운영(심사받지 않은 물리적 인프라 제외)<br />
               [유효기간] 2024.05.18 ~ 2027.05.17.
             </p>
          </div>
          <p className="text-[11px] text-gray-400 leading-5">
            번개장터(주)는 통신판매중개자이며, 통신판매의 당사자가 아닙니다. 전자상거래 등에서의 소비자보호에 관한 법률 등 관련 법령 및 번개장터(주)의 약관에 따라 상품, 상품정보, 거래에 관한 책임은 개별 판매자에게 귀속하고, 번개장터(주)는 원칙적으로 회원간 거래에 대하여 책임을 지지 않습니다. 다만, 번개장터(주)가 직접 판매하는 상품에 대한 책임은 번개장터(주)에게 귀속합니다.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
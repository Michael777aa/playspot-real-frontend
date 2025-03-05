import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/2024-10-19 21.42.01.jpg" />
		
				{/* SEO */}
				<meta name="keyword" content={'playspot, playspot.uz, devex mern, mern nestjs fullstack'} />
				<meta
					name={'description'}
					content={
						'Book sport arenas anywhere anytime in South Korea. Best arenas on best prices on playspot.uz| ' +
						'Бронируйте спортивные арены в любом месте в любое время в Южной Корее. Лучшие арены по лучшим ценам на playspot.uz | ' +
						'한국에서 언제 어디서나 스포츠 경기장을 예약하세요. 최고의 경기장을 최고의 가격으로 제공하는 playspot.uz'
					}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

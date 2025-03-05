import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import PopularFacilities from '../libs/components/homepage/PopularFacilities';
import TopAgents from '../libs/components/homepage/TopAgents';
import Events from '../libs/components/homepage/Events';
import TrendFacilities from '../libs/components/homepage/TrendFacilities';
import TopFacilities from '../libs/components/homepage/TopFacilities';
import { Stack } from '@mui/material';
import Advertisement from '../libs/components/homepage/Advertisement';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});
interface TopAgentsProps {
	orderNumber?: any;
}

const Home: NextPage = (props: TopAgentsProps) => {
	const { orderNumber } = props;
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<TrendFacilities />
				<PopularFacilities />
				<Advertisement />
				<TopFacilities />
				<TopAgents orderNumber={orderNumber} />
				<Events />
				<CommunityBoards />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<TrendFacilities />
				<PopularFacilities />
				<Advertisement />
				<TopFacilities />
				<TopAgents orderNumber={orderNumber} />
				<Events />
				<CommunityBoards />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);

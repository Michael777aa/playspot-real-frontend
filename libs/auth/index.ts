import decodeJWT from 'jwt-decode';
import { initializeApollo } from '../../apollo/client';
import { userVar } from '../../apollo/store';
import { CustomJwtPayload } from '../types/customJwtPayload';
import { sweetMixinErrorAlert } from '../sweetAlert';
import { LOGIN, SIGN_UP } from '../../apollo/user/mutation';

export function getJwtToken(): any {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('accessToken') ?? '';
	}
}

export function setJwtToken(token: string) {
	localStorage.setItem('accessToken', token);
}

export const logIn = async (nick: string, password: string): Promise<void> => {
	try {
		const { jwtToken } = await requestJwtToken({ nick, password });

		if (jwtToken) {
			updateStorage({ jwtToken });
			updateUserInfo(jwtToken);
		}
	} catch (err) {
		console.warn('Login error:', err);
		logOut();
		throw new Error('Login Error');
	}
};

const requestJwtToken = async ({
	nick,
	password,
}: {
	nick: string;
	password: string;
}): Promise<{ jwtToken: string }> => {
	const apolloClient = await initializeApollo();

	try {
		const result = await apolloClient.mutate({
			mutation: LOGIN,
			variables: { input: { memberNick: nick, memberPassword: password } },
			fetchPolicy: 'network-only',
		});

		const { accessToken } = result?.data?.login;

		return { jwtToken: accessToken };
	} catch (err: any) {
		console.error('Request token error:', err.graphQLErrors);
		const errorMessage = err.graphQLErrors[0]?.message;
		if (errorMessage) {
			handleLoginError(errorMessage);
		}
		throw new Error('Token error');
	}
};

const handleLoginError = async (errorMessage: string) => {
	switch (errorMessage) {
		case 'Definer: login and password do not match':
			await sweetMixinErrorAlert('Please check your password again');
			break;
		case 'Definer: user has been blocked!':
			await sweetMixinErrorAlert('User has been blocked!');
			break;
		default:
			await sweetMixinErrorAlert('An unknown error occurred');
	}
};

export const signUp = async (
	firstName: string,
	lastName: string,
	nick: string,
	password: string,
	memberEmail: string,
	phone: string,
	type: string,
): Promise<void> => {
	try {
		const { jwtToken } = await requestSignUpJwtToken({ firstName, lastName, nick, password, memberEmail, phone, type });

		if (jwtToken) {
			updateStorage({ jwtToken });
			updateUserInfo(jwtToken);
		}
	} catch (err) {
		console.warn('Sign up error:', err);
		logOut();
		throw new Error('Sign Up Error');
	}
};

const requestSignUpJwtToken = async ({
	firstName,
	lastName,
	nick,
	password,
	memberEmail,
	phone,
	type,
}: {
	firstName: string;
	lastName: string;
	nick: string;
	password: string;
	memberEmail: string;
	phone: string;
	type: string;
}): Promise<{ jwtToken: string }> => {
	const apolloClient = await initializeApollo();

	try {
		const result = await apolloClient.mutate({
			mutation: SIGN_UP,
			variables: {
				input: {
					memberFirstName: firstName,
					memberLastName: lastName,
					memberNick: nick,
					memberPassword: password,
					memberEmail: memberEmail,
					memberPhone: phone,
					memberType: type,
				},
			},
			fetchPolicy: 'network-only',
		});

		const { accessToken } = result?.data?.signup;

		return { jwtToken: accessToken };
	} catch (err: any) {
		console.error('Request token error:', err.graphQLErrors);
		const errorMessage = err.graphQLErrors[0]?.message;
		if (errorMessage) {
			handleSignUpError(errorMessage);
		}
		throw new Error('Token error');
	}
};

const handleSignUpError = async (errorMessage: string) => {
	switch (errorMessage) {
		case 'Definer: login and password do not match':
			await sweetMixinErrorAlert('Please check your password again');
			break;
		case 'Definer: user has been blocked!':
			await sweetMixinErrorAlert('User has been blocked!');
			break;
		default:
			await sweetMixinErrorAlert('An unknown error occurred');
	}
};

export const updateStorage = ({ jwtToken }: { jwtToken: any }) => {
	setJwtToken(jwtToken);
	window.localStorage.setItem('login', Date.now().toString());
};

export const updateUserInfo = (jwtToken: string) => {
	if (!jwtToken) return;

	const claims = decodeJWT<CustomJwtPayload>(jwtToken);
	userVar({
		_id: claims._id ?? '',
		memberType: claims.memberType ?? '',
		memberStatus: claims.memberStatus ?? '',
		memberAuthType: claims.memberAuthType,
		memberPhone: claims.memberPhone ?? '',
		memberNick: claims.memberNick ?? '',
		memberFirstName: claims.memberFirstName ?? '',
		memberLastName: claims.memberLastName ?? '',
		memberEmail: claims.memberEmail ?? '',
		memberImage:
			claims.memberImage === null || claims.memberImage === undefined
				? '/img/profile/defaultUserr.svg'
				: `${claims.memberImage}`,
		memberAddress: claims.memberAddress ?? '',
		memberDesc: claims.memberDesc ?? '',
		memberFacilities: claims.memberFacilities ?? 0,
		memberRank: claims.memberRank ?? 0,
		memberArticles: claims.memberArticles ?? 0,
		memberPoints: claims.memberPoints ?? 0,
		memberLikes: claims.memberLikes ?? 0,
		memberViews: claims.memberViews ?? 0,
		memberWarnings: claims.memberWarnings ?? 0,
		memberBlocks: claims.memberBlocks ?? 0,
	});
};

export const logOut = () => {
	deleteStorage();
	deleteUserInfo();
	window.location.reload();
};

const deleteStorage = () => {
	localStorage.removeItem('accessToken');
	window.localStorage.setItem('logout', Date.now().toString());
};

const deleteUserInfo = () => {
	userVar({
		_id: '',
		memberType: '',
		memberStatus: '',
		memberAuthType: '',
		memberPhone: '',
		memberNick: '',
		memberFirstName: '',
		memberLastName: '',
		memberEmail: '',
		memberImage: '',
		memberAddress: '',
		memberDesc: '',
		memberFacilities: 0,
		memberRank: 0,
		memberArticles: 0,
		memberPoints: 0,
		memberLikes: 0,
		memberViews: 0,
		memberWarnings: 0,
		memberBlocks: 0,
	});
};

export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

export const availableOptions = ['facilityBarter', 'facilityFacility'];

const thisYear = new Date().getFullYear();

export const facilityYears: any = [];

for (let i = 1970; i <= thisYear; i++) {
	facilityYears.push(String(i));
}

export const facilitySquare = [0, 25, 50, 75, 100, 125, 150, 200, 300, 500];

export const Messages = {
	error1: 'Something went wrong!',
	error2: 'Please login first!',
	error3: 'Please fulfill all inputs!',
	error4: 'Message is empty!',
	error5: 'Only images with jpeg, jpg, png format allowed!',
};

export const topFacilityRank = 0;

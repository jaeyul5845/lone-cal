import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = 'G-01G9NT2SGX';

export const initGA = () => {
  if (GA_MEASUREMENT_ID) {
    ReactGA.initialize(GA_MEASUREMENT_ID);
    console.log('GA initialized');
  } else {
    console.warn('GA_MEASUREMENT_ID is not defined. Google Analytics will not be initialized.');
  }
};

export const logPageView = (path: string) => {
  if (GA_MEASUREMENT_ID) {
    ReactGA.send({ hitType: 'pageview', page: path });
    console.log('Page view logged:', path);
  }
};

// You can add more event tracking functions here as needed
export const logEvent = (category: string, action: string, label?: string) => {
  if (GA_MEASUREMENT_ID) {
    ReactGA.event({
      category,
      action,
      label,
    });
    console.log('Event logged:', { category, action, label });
  }
};

/**
 * Brand Colors Mapping
 *
 * For consistency across the project:
 * - Primary (dark green): success-900 (#074D31) - Use for primary buttons, active states
 * - Secondary/Accent (light green): primary-600 (#1B8354) - Use for secondary elements
 * - 'green' palette is mapped to 'success' colors in tailwind.config.js
 *
 * Usage:
 * - Tailwind classes: bg-green-700, text-green-600 → will use success colors
 * - Icon backgrounds: background="green" → uses success-900 (#074D31)
 * - Buttons: intent="primary" → uses success-900 (#074D31)
 */

export const colors = {
  primary: {
    25: '#F7FDF9',
    50: '#F3FCF6',
    100: '#DFF6E7',
    200: '#B8EACB',
    300: '#88D8AD',
    400: '#54C08A',
    500: '#25935F',
    600: '#1B8354',
    700: '#166A45',
    800: '#14573A',
    900: '#104631',
    950: '#092A1E',
  },
  success: {
    25: '#F6FEF9',
    50: '#ECFDF3',
    100: '#DCFAE6',
    200: '#ABDFC6',
    300: '#75E0A7',
    400: '#47CD89',
    500: '#17B26A',
    600: '#079455',
    700: '#067647',
    800: '#085D3A',
    900: '#074D31',
    950: '#053321',
  },
  info: {
    25: '#F5FAFF',
    50: '#EFF8FF',
    100: '#D1E9FF',
    200: '#B2DDFF',
    300: '#84CAFF',
    400: '#53B1FD',
    500: '#2E90FA',
    600: '#1570EF',
    700: '#175CD3',
    800: '#1849A9',
    900: '#194185',
    950: '#102A56',
  },
  warning: {
    25: '#FFFCF5',
    50: '#FFFAEB',
    100: '#FEF0C7',
    200: '#FEDF89',
    300: '#FEC84B',
    400: '#FDB022',
    500: '#F79009',
    600: '#DC6803',
    700: '#B54708',
    800: '#93370D',
    900: '#7A2E0E',
    950: '#4E1D09',
  },
  error: {
    25: '#FFF8FA',
    50: '#FEF3F2',
    100: '#FEE4E2',
    200: '#FECDCA',
    300: '#FDA29B',
    400: '#F97066',
    500: '#F04438',
    600: '#D92D20',
    700: '#B42318',
    800: '#912018',
    900: '#7A271A',
    950: '#55160C',
  },
  gold: {
    25: '#FFFFF7',
    50: '#FFFFF2',
    100: '#FFFCF6',
    200: '#FCF3BD',
    300: '#FAE996',
    400: '#F7D54D',
    500: '#F5BD02',
    600: '#DBA102', // Primary 600
    700: '#B87B02',
    800: '#945C01',
    900: '#6E3C00',
    950: '#472400',
  },
  lavender: {
    25: '#FEFCFF',
    50: '#F9F5FA',
    100: '#F2E9F5',
    200: '#E1CCE8',
    300: '#CCADD9',
    400: '#A578BA',
    500: '#80519F', // Primary 500
    600: '#6D428F',
    700: '#532D75',
    800: '#3D1D5E',
    900: '#281047',
    950: '#16072E',
  },
  gray: {
    25: '#FCFCFD',
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D2D6DB',
    400: '#9DA4AE',
    500: '#6C737F',
    600: '#4D5761',
    700: '#384250',
    800: '#1F2A37',
    900: '#111927',
    950: '#0D121C',
  },
};

export type ColorKeys = keyof typeof colors;

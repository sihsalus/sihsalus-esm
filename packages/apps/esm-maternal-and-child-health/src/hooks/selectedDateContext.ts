import { createContext } from 'react';
import dayjs from 'dayjs';

const omrsDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';

const SelectedDateContext = createContext({
  selectedDate: dayjs().startOf('day').format(omrsDateFormat),

  setSelectedDate: (date: string) => {},
});

export default SelectedDateContext;

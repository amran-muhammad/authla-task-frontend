import { useUserSession } from '/@src/stores/userSession'
import { themeColors } from '/@src/utils/themeColors'

export const userSession = useUserSession()

export const customersOptions = {
  series: [
    {
      name: 'Application',
      data: userSession.applications,
    },
  ],
  chart: {
    height: 295,
    type: 'area',
    toolbar: {
      show: false,
    },
  },
  colors: [themeColors.accent, themeColors.info, themeColors.green],
  title: {
    text: 'Job Application',
    align: 'left',
  },
  legend: {
    position: 'top',
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: [2, 2, 2],
    curve: 'smooth',
  },
  xaxis: {
    type: 'datetime',
    categories: userSession.days,
  },
  tooltip: {
    x: {
      format: 'dd/MM/yy HH:mm',
    },
  },
}
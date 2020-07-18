import zIndex from '@material-ui/core/styles/zIndex'

const themeObj = {
  palette: {
    primary: {
      // light: '',
      main: '#00b5ad', //teal
      dark: '059b93'
      // contrastText: '#fff',
    },
    secondary: {
      light: '',
      main: '#6369D1', //purple-ish
      dark: ''
      // contrastText: '#fff',
    },
    // divider: '#b4b4b44d',
    background: {
      default: '#eee'
    }
    // typography: {
    //   fontFamily: "Montserrat, 'Segoe UI', Tahoma, sans-serif",
    // }
  },
  zIndex: {
    appBar: zIndex.drawer + 1
  },
  props: {
    MuiButton: {
      variant: 'contained'
    },
    MuiTextField: {
      variant: 'outlined'
    }
  },
  overrides: {
    MuiButton: {
      contained: {
        color: '#fff',
        // backgroundColor: '#6369D1', //purple
        backgroundColor: '#9c27b0' //pinkish purple
      }
    }
  }
}

export default themeObj

export const blackColor = '#000'
export const whiteColor = '#FFF'
export const thirdColor = {
  //lime
  // light: "#4caf50",
  main: '#b5cc18',
  dark: '#99ad13',
  contrastText: '#000'
}
export const fourthColor = {
  //bright purple
  main: '#9c27b0',
  contrastText: '#fff'
}
export const grayColor = [
  '#999',
  '#777',
  '#3C4858',
  '#AAAAAA',
  '#D2D2D2',
  '#DDD',
  '#b4b4b4',
  '#555555',
  '#333',
  '#a9afbb',
  '#eee',
  '#e7e7e7'
]

export const hexToRgb = input => {
  input = input + ''
  input = input.replace('#', '')
  let hexRegex = /[0-9A-Fa-f]/g
  if (!hexRegex.test(input) || (input.length !== 3 && input.length !== 6)) {
    throw new Error('input is not a valid hex color.')
  }
  if (input.length === 3) {
    let first = input[0]
    let second = input[1]
    let last = input[2]
    input = first + first + second + second + last + last
  }
  input = input.toUpperCase()
  let first = input[0] + input[1]
  let second = input[2] + input[3]
  let last = input[4] + input[5]
  return (
    parseInt(first, 16) +
    ', ' +
    parseInt(second, 16) +
    ', ' +
    parseInt(last, 16)
  )
}

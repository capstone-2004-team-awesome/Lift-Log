import zIndex from '@material-ui/core/styles/zIndex'

const themeObj = {
  palette: {
    primary: {
      main: '#00b5ad'
    }
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
        backgroundColor: '#6369D1'
      }
    }
  }
}

export default themeObj

import zIndex from '@material-ui/core/styles/zIndex'

// TODO: fix button props because this messes up the display in the menu bar
const themeObj = {
  props: {
    MuiButton: {
      // variant: 'contained',
      color: 'primary'
    }
  },
  zIndex: {
    appBar: zIndex.drawer + 1
  }
}

export default themeObj

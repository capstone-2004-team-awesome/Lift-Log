import zIndex from '@material-ui/core/styles/zIndex'

// TODO: fix button props because this messes up the display in the menu bar
const themeObj = {
  // can override the box shadow here and remove it so appbar buttons don't have it
  // right now removing box-shadow is done in Navbar makeStyles
  // overrides: {
  //   MuiButton: {
  //     root: {
  //       boxShadow: '0px 0px'
  //     }
  //   }
  // },
  props: {
    MuiButton: {
      variant: 'contained',
      color: 'primary'
    }
  },
  zIndex: {
    appBar: zIndex.drawer + 1
  }
}

export default themeObj

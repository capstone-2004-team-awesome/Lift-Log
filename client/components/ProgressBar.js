import React, {Component} from 'react'

/**
 * A progress bar shows the progression of a task.
 */
class ProgressBar extends Component {
  calculatePercent = () => {
    const {percent} = this.props.data
    const {total, value} = this.props
    if (percent) return percent
    if (total && value) return value / total * 100
  }

  computeValueText = percent => {
    const {progress} = this.props.data
    const {total, value} = this.props
    if (progress === 'value') return value
    if (progress === 'ratio') return `${value}/${total}`
    return `${percent}%`
  }

  renderLabel = () => {
    const {labelContent} = this.props.data
    if (labelContent) return <div className="label">{labelContent}</div>
  }

  renderProgress = percent => {
    const {progress} = this.props.data
    console.log('Render Progress: ', progress)

    if (!progress) return
    return <div className="progress">{this.computeValueText(percent)}</div>
  }

  renderClasses = classArr => {
    return classArr.join(' ')
  }

  render() {
    const classes = this.renderClasses([
      'ui',
      this.props.data.color,
      this.props.data.size,
      'progress',
      this.props.data.className
    ])
    const percent = this.calculatePercent() || 0
    console.log('Percent: ', this.calculatePercent())

    return (
      <div className={classes} data-percent={Math.floor(percent)}>
        <div className="bar" style={{width: `${percent}%`}}>
          {this.renderProgress(percent)}
        </div>
        {this.renderLabel()}
      </div>
    )
  }
}

export default ProgressBar

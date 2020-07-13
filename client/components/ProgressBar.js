import React from 'react'
import {Bar} from 'react-chartjs-2'

const state = {
  labels: ['January', 'February'],
  datasets: [
    {
      label: 'Rainfall',
      backgroundColor: 'rgba(75,192,192,1)',
      borderColor: 'rgba(0,0,0,1)',
      borderWidth: 2,
      data: [65, 59]
    }
  ]
}

export default class ProgressBar extends React.Component {
  render() {
    return (
      <div>
        <Bar
          data={state}
          width={30}
          height={10}
          options={{
            title: {
              display: true,
              text: 'Average Rainfall per month',
              fontSize: 20
            },
            legend: {
              display: true,
              position: 'right'
            }
          }}
        />
      </div>
    )
  }
}

import React from "react"
import { projects } from "src/lib/globals/data"
import { ProjectWrapper } from "src/lib/globals/GlobalWrapper"
import MLHelper from "src/lib/linear/learn_line/neural_net"
import { NumberInput, Flex, Button } from "@chakra-ui/core"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import Neuron from "./neuron"
import { Centered } from "src/lib/components/commons"

export class LearnLine extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      m: null,
      c: null,
      randomX: [],
      randomY: [],
      predM: null,
      predC: null,
      data: [],
      lossData: [],
      didTrainingStart: false,
      isTraining: false,
    }
    this.nn = new MLHelper()
    this.project = projects.learn_line
    this.neuronRef = React.createRef()
  }

  // ----- RENDERERS ---------------------

  render() {
    return (
      <ProjectWrapper project={this.project}>
        <Centered>
          <Neuron ref={this.neuronRef} />
          {this.getEquationInput()}
          {!this.state.didTrainingStart && (
            <Button
              variantColor="brand"
              borderRadius="lg"
              onClick={() => this.startTrainingPipeline()}
            >
              TRAIN
            </Button>
          )}
          {this.state.didTrainingStart && this.showStopTrainingButton()}
          {this.state.didTrainingStart && this.getGraph()}
          <Flex justifyContent="center" mt={4}>
            {this.state.didTrainingStart && this.getParametersGraph()}
            {this.state.didTrainingStart && this.getLossGraph()}
          </Flex>
        </Centered>
      </ProjectWrapper>
    )
  }

  getEquationInput() {
    return (
      <Flex alignItems="center" justifyContent="center" mb={4}>
        y = m:
        {this.getParamsPicker("M")} x + c:
        {this.getParamsPicker("C")}
      </Flex>
    )
  }

  showStopTrainingButton() {
    return (
      <Button
        variant="outline"
        variantColor="brand"
        onClick={() => this.setState({ isTraining: false })}
      >
        Stop
      </Button>
    )
  }

  getGraph() {
    return (
      <LineChart
        width={800}
        height={500}
        data={this.state.data}
        margin={{
          top: 100,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="realX" type="number" scale="auto" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="realY" stroke="#8884d8" />
        <Line type="monotone" dataKey="predY" stroke="#82ca9d" />
      </LineChart>
    )
  }

  getParametersGraph() {
    return (
      <table className={"table"} style={{ width: 300 }}>
        <tbody>
          <tr>
            <th />
            <th>Real</th>
            <th>Predicted</th>
          </tr>
          <tr>
            <td>m</td>
            <td>{this.state.m}</td>
            <td>{this.state.predM}</td>
          </tr>
          <tr>
            <td>c</td>
            <td>{this.state.c}</td>
            <td>{this.state.predC}</td>
          </tr>
        </tbody>
      </table>
    )
  }

  getLossGraph() {
    return (
      <LineChart
        width={500}
        height={300}
        data={this.state.lossData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="index" type="number" scale="auto" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="loss" stroke="#8884d8" />
      </LineChart>
    )
  }

  getParamsPicker(params) {
    if (params === "M")
      return (
        <NumberInput
          maxW="70px"
          placeholder="m"
          mx={2}
          onChange={value => this.setState({ m: value })}
        />
      )
    else if (params === "C") {
      return (
        <NumberInput
          maxW="70px"
          placeholder="c"
          mx={2}
          onChange={value => this.setState({ c: value })}
        />
      )
    }
  }

  // --------- OTHERS ---------------------

  startTrainingPipeline() {
    if (this.state.m == null) {
      this.showError("M is not set.")
      return
    }
    if (this.state.c == null) {
      this.showError("C is not set.")
      return
    }

    let m = this.state.m
    let c = this.state.c

    let randomData = this.nn.generateRandomLineData(m, c, 10)

    this.setState(
      {
        realM: m,
        realC: c,
        randomX: randomData.x,
        randomY: randomData.y,
        isTraining: true,
        didTrainingStart: true,
        lossData: [],
        data: this.createRealData(randomData.x, randomData.y),
      },
      () => {
        this.train(randomData.x, randomData.y)
      }
    )
  }

  train(x, y) {
    let epochs = 1000
    let t = 0
    let self = this

    let trainingLoop = function (epoch) {
      console.log(epoch)
      if (epoch <= epochs) {
        setTimeout(() => {
          let randomIndex = Math.floor(Math.random() * x.length)

          if (!self.state.isTraining) {
            epoch = epochs
            return
          }
          let loss = self.nn.fullPass(x[randomIndex], y[randomIndex])

          let predParams = self.nn.getWeights()

          self.showLoss(loss, t++)
          self.updatePredLine(predParams)
          self.neuronRef.current.set({ w: predParams.m, b: predParams.c })

          trainingLoop(epoch + 1)
        }, 100) // wait 5000 milliseconds then recheck
      }
    }

    trainingLoop(0)
  }

  createRealData(x, y) {
    let data = []
    for (let i = 0; i < x.length; i++) {
      data.push({ realX: x[i], realY: y[i] })
    }
    return data
  }

  showLoss(loss, index) {
    this.setState({
      lossData: this.state.lossData.concat([
        { index: index, loss: loss.dataSync()[0] },
      ]),
    })
  }

  updatePredLine(predParams) {
    let data = []
    for (let i = 0; i < this.state.data.length; i++) {
      let column = this.state.data[i]
      column.predX = column.realX
      column.predY =
        parseFloat(column.realX) * parseFloat(predParams.m) +
        parseFloat(predParams.c)
      data.push(column)
    }
    this.setState({ data: data, predM: predParams.m, predC: predParams.c })
  }

  showError(message) {
    alert(message)
  }
}

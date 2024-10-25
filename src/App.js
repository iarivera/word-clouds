import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {wordFrequency:[]};
  }
  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  getWordFrequency = (text) => {
    const stopWords = new Set(["the", "and", "a", "an", "in", "on", "at", "for", "with", "about", "as", "by", "to", "of", "from", "that", "which", "who", "whom", "this", "these", "those", "it", "its", "they", "their", "them", "we", "our", "ours", "you", "your", "yours", "he", "him", "his", "she", "her", "hers", "it", "its", "we", "us", "our", "ours", "they", "them", "theirs", "I", "me", "my", "myself", "you", "your", "yourself", "yourselves", "was", "were", "is", "am", "are", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "as", "if", "each", "how", "which", "who", "whom", "what", "this", "these", "those", "that", "with", "without", "through", "over", "under", "above", "below", "between", "among", "during", "before", "after", "until", "while", "of", "for", "on", "off", "out", "in", "into", "by", "about", "against", "with", "amongst", "throughout", "despite", "towards", "upon", "isn't", "aren't", "wasn't", "weren't", "haven't", "hasn't", "hadn't", "doesn't", "didn't", "don't", "doesn't", "didn't", "won't", "wouldn't", "can't", "couldn't", "shouldn't", "mustn't", "needn't", "daren't", "hasn't", "haven't", "hadn't"]);
    const words = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=_`~()]/g, "").replace(/\s{2,}/g, " ").split(" ");
    const filteredWords = words.filter(word => !stopWords.has(word));
    return Object.entries(filteredWords.reduce((freq, word) => {
      freq[word] = (freq[word] || 0) + 1;
      return freq;
    }, {}));
  }

  /*The streets were filled with people, people walking, people talking, people laughing, people in a hurry. Everyone seemed to be in a rush, moving quickly from one place to another. The city was alive with activity, with people everywhere you looked. The noise of the city was constant, with cars honking, people chatting, and footsteps echoing through the streets. It was a city full of people, a city where life never stopped.*/
  /*The streets stretched endlessly, weaving through the heart of the city, connecting neighborhoods in a seamless flow. In every corner of the city, there was something happening, whether it was the vibrant market stalls or the quiet parks hidden amidst the urban landscape. The city skyline towered above, a reminder of the ambition and drive that defined the city. As night fell, the lights of the city illuminated the streets, casting a glow that reminded everyone just how alive the city truly was.*/

  renderChart() {
    const data = this.state.wordFrequency.sort((a,b)=>b[1]-a[1]).slice(0,5)
    console.log(data)
    // your code here
    d3.select('svg').selectAll('*').remove();
    
    const margin = { top: 50, right: 10, bottom: 50, left: 30},
      w = 1000 - margin.left - margin.right,
      h = 300 - margin.top - margin.bottom;

    const svg = d3.select(".svg_parent")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    const fontScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[1]), d3.max(data, d => d[1])])
      .range([20,80]);
    
    let cumulX = 100;

    const text = svg.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text(d => d[0])
      .attr("font-size", 0)
      .attr("x", function(d, i) {
        const wordLen = this.getComputedTextLength();
        const currX = cumulX;
        cumulX += wordLen + 150;
        return currX;
      })
      .attr("y", h / 2)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("font-family", "Times New Roman");
      
    text.transition()
      .duration(2500)
      .attr("font-size", d => fontScale(d[1]))
  }

  render() {
    return (
      <div className="parent">
        <div className="child1" style={{width: 1000 }}>
        <textarea type="text" id="input_field" style={{ height: 150, width: 1000 }}/>
          <button type="submit" value="Generate Matrix" style={{ marginTop: 10, height: 40, width: 1000 }} 
          onClick={() => {
                var input_data = document.getElementById("input_field").value
                this.setState({wordFrequency:this.getWordFrequency(input_data)})
              }}
            > Generate WordCloud</button>
        </div>
        <div className="child2"><svg className="svg_parent"></svg></div>
      </div>
    );
  }
}

export default App;

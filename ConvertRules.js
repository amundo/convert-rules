class ConvertRules extends HTMLElement {
  constructor(){
    super()

    this.innerHTML = `
  <textarea class=rules></textarea>
  <textarea class=ephemeral></textarea>
  <textarea class=output></textarea>
    `
    this.listen()
  }

  applyRules(s){

    this.rules.forEach(([before,after]) => {
      s = s.replaceAll(before, after)
    })
    
    return s
  }

  async fetch(url){
    let response = await fetch(url)
    let data = await response.json()
    this.data = data
  }

  connectedCallback(){

  }

  get rules(){
    let rawRules = this.querySelector('textarea.rules').value

    return rawRules.trim().split('\n')
      .map(line => line.trim()
        .split("\t")
        .map(line => line.trim())
      )
  }

  static get observedAttributes(){
    return ["src"]
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == "src"){
      this.fetch(newValue)
    }
  }

  render(){
    // edit .innerHTML here
  }

  listen(){
    this.querySelector("textarea.rules").addEventListener('change', changeEvent => {
      localStorage.rules = changeEvent.target.value
    })

    addEventListener('load', () => {
      console.log(`hi i loaded`)
      this.querySelector('textarea').value = localStorage.rules

    })
    this.addEventListener('keyup', pasteEvent => {
      let emphemeralString = this.querySelector('textarea.ephemeral').value
      let unicodeString = this.applyRules(emphemeralString)

      this.querySelector('textarea.output').value = unicodeString
    })
  }
}

export {ConvertRules}
customElements.define('convert-rules', ConvertRules)

import React,{Component} from "react"
import contentEditDivScss from "./contentEditDiv.scss"


class ContentEditDiv extends Component{

    constructor(props){
        super(props)
        this.contentedit = React.createRef()

    }

    render(){
        return <div
            className="edit-area"
            onInput={()=>this.emitChange()}
            onBlur={()=>this.emitChange()}
            contentEditable
            ref={this.contentedit}
            onKeyDown={(e)=>this.handleInputSubmit(e)}
            dangerouslySetInnerHTML={{__html: this.props.html}}></div>;
    }
    shouldComponentUpdate(nextProps){
        // if(this.props.html==""){
        //     return true
        // }
        return (nextProps.html !== this.contentedit.current.innerHTML);

    }

    componentDidUpdate() {
        if ( this.props.html !== this.contentedit.current.innerHTML ) {
           this.contentedit.current.innerHTML = this.props.html;
        }
    }


    clearHtml(){

    }

    emitChange(){
        var html = this.contentedit.current.innerHTML;
        if (this.props.onChange && html !== this.lastHtml) {

            this.props.onChange({
                target: {
                    value: html
                }
            });
        }
        this.lastHtml = html;
    }

    handleFocus(){
        this.contentedit.current.focus()
    }

    handleInputSubmit(e){
        let self = this
        if(e.keyCode==13){
            e.preventDefault()
            if(self.props.submit){
                self.props.submit()
            }

        }
    }
}

export default ContentEditDiv
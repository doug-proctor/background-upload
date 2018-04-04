import React, { Component } from 'react'
import Axios from 'axios' // Axios supports upload progress

class App extends Component {

    constructor() {
        super()
        this.state = {
            uploadProgress: ''
        }
    }

    handleSubmit = (ev) => {
        ev.preventDefault()
        const file = this.fileField.files[0]
        this.postFile(file)
        this.startAnnotation(file)
    }

    postFile(file) {
        const data = new FormData()
        data.append('file', file)

        const config = {
            onUploadProgress: this.onUploadProgress
        }

        Axios.post('http://localhost:8000/hive', data, config)
            .then(function (res) {
                console.log(res)
            })
            .catch(function (err) {
                console.error(err.message)
            })
    }

    onUploadProgress = (progressEvent) => {
        var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total )
        this.setState({
            uploadProgress: percentCompleted + "%"
        })
    }

    startAnnotation = (file) => {
        this.source.src = URL.createObjectURL(file)
        this.video.load()
    }

    render() {
        return (
            <div>
                <video
                    ref={ node => this.video = node }
                    style={{width: "100%"}}
                    autoPlay
                    controls
                >
                    <source
                        src="none"
                        ref={ node => this.source = node }
                    />
                </video>
                <form
                    onSubmit={ this.handleSubmit }
                    ref={ node => this.form = node }
                    encType="multipart/form-data"
                >
                    <input
                        type="file"
                        name="file"
                        ref={ node => this.fileField = node }
                    />
                    <button type="submit">Upload</button>
                </form>
                <p>Upload progress: { this.state.uploadProgress }</p>
            </div>
        )
    }
}

export default App

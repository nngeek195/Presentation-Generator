import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './ProfilePictureModal.css';
import { FaTimes, FaCheck } from 'react-icons/fa';

class ProfilePictureModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pictureOptions: [],
            selectedPicture: null,
            selectedImageId: null,
            loading: true
        };
    }

    componentDidMount() {
        this.fetchPictureOptions();
    }

    fetchPictureOptions = async () => {
        try {
            const response = await fetch('https://par-assist-as-amber.trycloudflare.com/profilePictureOptions/6');
            const data = await response.json();

            if (data.success && data.data) {
                this.setState({
                    pictureOptions: data.data,
                    loading: false
                });
            }
        } catch (error) {
            console.error('Error fetching picture options:', error);
            this.setState({ loading: false });
        }
    };

    handlePictureSelect = (pictureUrl, imageId) => {
        this.setState({
            selectedPicture: pictureUrl,
            selectedImageId: imageId
        });
    };

    handleConfirm = () => {
        if (this.state.selectedPicture) {
            this.props.onUpdatePicture(this.state.selectedPicture, this.state.selectedImageId);
        }
    };

    render() {
        const { isOpen, onClose, currentPicture } = this.props;
        const { pictureOptions, selectedPicture, loading } = this.state;

        if (!isOpen) return null;

        return ReactDOM.createPortal(
            <div className='modal-overlay'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h2>Choose Profile Picture</h2>
                        <button className='close-button' onClick={onClose}>
                            <FaTimes />
                        </button>
                    </div>

                    <div className='modal-body'>
                        {loading ? (
                            <div className='loading'>Loading pictures...</div>
                        ) : (
                            <div className='picture-grid'>
                                {currentPicture && (
                                    <div
                                        className={`picture-option ${selectedPicture === currentPicture ? 'selected' : ''}`}
                                        onClick={() => this.handlePictureSelect(currentPicture, null)}
                                    >
                                        <img src={currentPicture} alt='Current' />
                                        <div className='picture-label'>Current</div>
                                    </div>
                                )}

                                {pictureOptions.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`picture-option ${selectedPicture === image.urls.regular ? 'selected' : ''}`}
                                        onClick={() => this.handlePictureSelect(image.urls.regular, image.id)}
                                    >
                                        <img src={image.urls.regular} alt={`Option ${index + 1}`} />
                                        {selectedPicture === image.urls.regular && (
                                            <div className='selected-indicator'>
                                                <FaCheck />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className='modal-footer'>
                        <button className='cancel-button' onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            className='confirm-button'
                            onClick={this.handleConfirm}
                            disabled={!selectedPicture}
                        >
                            Update Picture
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        );
    }
}

export default ProfilePictureModal;

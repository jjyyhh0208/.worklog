import React, { useState, useEffect } from 'react';
import API from '../utils/API';
import ProfileService from '../utils/ProfileService';

const UploadImage = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileData = await ProfileService.fetchUserProfile();
                if (profileData.profile_image && profileData.profile_image.image) {
                    const signedUrl = await ProfileService.getSignedImageUrl(profileData.profile_image.image);
                    setImageUrl(signedUrl);
                }
            } catch (error) {
                console.error('Error fetching profile data.', error);
            }
        };

        fetchData();
    }, []);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await API.post('/profiles/user/set/profile-image/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Image uploaded successfully');
            const profileData = await ProfileService.fetchUserProfile();
            if (profileData.profile_image && profileData.profile_image.image) {
                const signedUrl = await ProfileService.getSignedImageUrl(profileData.profile_image.image);
                setImageUrl(signedUrl);
            }
        } catch (error) {
            if (error.response) {
                setMessage(`Failed to upload image: ${error.response.data}`);
            } else {
                setMessage('Failed to upload image');
            }
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {message && <p>{message}</p>}
            {imageUrl && <img src={imageUrl} alt="Profile" />}
        </div>
    );
};

export default UploadImage;

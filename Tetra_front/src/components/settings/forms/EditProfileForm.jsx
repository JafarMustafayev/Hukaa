// src/components/settings/forms/EditProfileForm.jsx
import React, { useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import SettingsInput from '../SettingsInput.jsx';
import SettingsButton from '../SettingsButton.jsx';
import { EditProfileSkeleton } from '../../skeletons/index.js';
import { useAuth } from '../../../context/AuthContext';
import { getSettingsProfile, updateSettingsProfile } from '../../../api/settings.api.js';
import { toast } from 'react-hot-toast';
import getCroppedImg from '../../../utils/cropImage.js';
import { API_BASE_URL } from '../../../api/apiConfig.js';

// Helper: Resolve relative image URLs with the API Base URL
const resolveImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
        return url;
    }
    const baseUrl = API_BASE_URL || '';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${cleanBase}${cleanPath}`;
};

const EditProfileForm = ({ onBack }) => {
    const { user, updateCurrentUser } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [initialProfile, setInitialProfile] = useState(null);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        bio: "",
        birthday: "",
        website: "",
        gender: 1
    });

    // Image States
    const [coverImage, setCoverImage] = useState();
    const [avatarImage, setAvatarImage] = useState();

    // Cropping States
    const [imageToCrop, setImageToCrop] = useState(null);
    const [cropType, setCropType] = useState('avatar'); // 'avatar' or 'cover'
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    // Fetch Profile Settings on Mount
    useEffect(() => {
        let isMounted = true;
        const fetchProfile = async () => {
            try {
                const response = await getSettingsProfile();
                const success = response.success ?? response.Success;
                if (success && response.data) {
                    const profileData = response.data;
                    if (isMounted) {
                        const initial = {
                            firstName: profileData.firstName || "",
                            lastName: profileData.lastName || "",
                            bio: profileData.bio || "",
                            birthday: profileData.birthday || "",
                            website: profileData.website || "",
                            gender: profileData.gender ?? 1,
                            avatarImage: resolveImageUrl(profileData.profileImageUrl),
                            coverImage: resolveImageUrl(profileData.coverImageUrl)
                        };
                        setForm({
                            firstName: initial.firstName,
                            lastName: initial.lastName,
                            bio: initial.bio,
                            birthday: initial.birthday,
                            website: initial.website,
                            gender: initial.gender
                        });
                        setAvatarImage(initial.avatarImage);
                        setCoverImage(initial.coverImage);
                        setInitialProfile(initial);
                    }
                } else {
                    const errorMsg = response.Message || response.message || "Failed to load profile settings.";
                    toast.error(errorMsg);
                }
            } catch (error) {
                console.error("Error fetching profile settings:", error);
                toast.error("An unexpected error occurred while loading profile settings.");
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchProfile();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleInputChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImageToCrop(reader.result);
            setCropType(type);
            setZoom(1);
            setCrop({ x: 0, y: 0 });
        };
        reader.readAsDataURL(file);
        e.target.value = ''; // Reset input selection
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCropSave = async () => {
        try {
            if (!imageToCrop || !croppedAreaPixels) return;
            const croppedImageBase64 = await getCroppedImg(imageToCrop, croppedAreaPixels);
            if (cropType === 'avatar') {
                setAvatarImage(croppedImageBase64);
            } else {
                setCoverImage(croppedImageBase64);
            }
            setImageToCrop(null);
        } catch (e) {
            console.error("Error cropping image:", e);
        }
    };

    const isModified = initialProfile ? (
        (form.firstName || '').trim() !== initialProfile.firstName ||
        (form.lastName || '').trim() !== initialProfile.lastName ||
        (form.bio || '') !== initialProfile.bio ||
        (form.birthday || '') !== initialProfile.birthday ||
        (form.website || '') !== initialProfile.website ||
        (form.gender ?? 1) !== initialProfile.gender ||
        avatarImage !== initialProfile.avatarImage ||
        coverImage !== initialProfile.coverImage
    ) : false;

    const handleSave = async (e) => {
        e.preventDefault();

        if (!form.firstName?.trim()) {
            toast.error("First name is required.");
            return;
        }
        if (!form.lastName?.trim()) {
            toast.error("Last name is required.");
            return;
        }

        setIsSaving(true);
        try {
            const formData = new FormData();
            // Send both FirstName, firstname, and Fistname for compatibility
            formData.append('FirstName', form.firstName.trim());
            formData.append('firstname', form.firstName.trim());
            formData.append('Fistname', form.firstName.trim());

            // Send both LastName, lastname, and lastName for compatibility
            formData.append('LastName', form.lastName.trim());
            formData.append('lastname', form.lastName.trim());
            formData.append('lastName', form.lastName.trim());

            formData.append('bio', form.bio || '');
            formData.append('website', form.website || '');
            formData.append('gender', form.gender ?? 1);
            formData.append('birthday', form.birthday || '');

            if (avatarImage && (avatarImage.startsWith('blob:') || avatarImage.startsWith('data:'))) {
                try {
                    const res = await fetch(avatarImage);
                    const blob = await res.blob();
                    formData.append('ProfileImage', blob, 'avatar.jpg');
                } catch (err) {
                    console.error("Failed to append ProfileImage:", err);
                }
            }
            if (coverImage && (coverImage.startsWith('blob:') || coverImage.startsWith('data:'))) {
                try {
                    const res = await fetch(coverImage);
                    const blob = await res.blob();
                    formData.append('CoverImage', blob, 'cover.jpg');
                } catch (err) {
                    console.error("Failed to append CoverImage:", err);
                }
            }

            const response = await updateSettingsProfile(formData);
            const success = response.success ?? response.Success;

            if (success) {
                toast.success(response.message || "Profile updated successfully.");
                const updatedData = response.data || response.Data;
                if (updatedData) {
                    const newProfile = {
                        firstName: updatedData.firstName || "",
                        lastName: updatedData.lastName || "",
                        bio: updatedData.bio || "",
                        birthday: updatedData.birthday || "",
                        website: updatedData.website || "",
                        gender: updatedData.gender ?? 1,
                        avatarImage: resolveImageUrl(updatedData.profileImageUrl),
                        coverImage: resolveImageUrl(updatedData.coverImageUrl)
                    };

                    setForm({
                        firstName: newProfile.firstName,
                        lastName: newProfile.lastName,
                        bio: newProfile.bio,
                        birthday: newProfile.birthday,
                        website: newProfile.website,
                        gender: newProfile.gender
                    });
                    setAvatarImage(newProfile.avatarImage);
                    setCoverImage(newProfile.coverImage);
                    setInitialProfile(newProfile);

                    if (updateCurrentUser) {
                        updateCurrentUser({
                            firstName: newProfile.firstName,
                            lastName: newProfile.lastName,
                            name: `${newProfile.firstName} ${newProfile.lastName}`.trim(),
                            bio: newProfile.bio,
                            profileImageUrl: newProfile.avatarImage,
                            avatarUrl: newProfile.avatarImage,
                            coverImageUrl: newProfile.coverImage,
                            coverUrl: newProfile.coverImage
                        });
                    }
                }
            } else {
                const errorMsg = response.message || response.Message || "Failed to update profile.";
                toast.error(errorMsg);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("An unexpected error occurred while updating profile.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <EditProfileSkeleton onBack={onBack} />;
    }

    // Get initials fallback (Username first letter)
    const usernameLetter = user?.username?.[0]?.toUpperCase() || form.firstName?.[0]?.toUpperCase() || 'U';

    return (
        <div className="w-full h-full flex flex-col overflow-y-auto custom-scrollbar bg-white dark:bg-[#09090b]">
            {/* Header/title area */}
            <div className="px-4 pt-3 sticky top-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md z-10 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] flex items-center justify-center transition-colors"
                >
                    <i className="ri-arrow-left-line text-xl text-gray-900 dark:text-white"></i>
                </button>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit profile</h2>
            </div>

            <div className="p-4 md:px-6 md:py-2 max-w-[600px] space-y-6">
                {/* Section title */}
                <h3 className="font-bold text-[18px] text-gray-900 dark:text-white mb-6">Profile</h3>

                <form onSubmit={handleSave} className="space-y-6">
                    {/* Hidden File Inputs */}
                    <input
                        type="file"
                        id="cover-upload"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'cover')}
                        className="hidden"
                    />
                    <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'avatar')}
                        className="hidden"
                    />

                    {/* Cover photo block */}
                    <div className="space-y-3">
                        <label className="block text-[15px] font-bold text-gray-900 dark:text-white">
                            Cover photo
                        </label>
                        <div className="relative w-full h-40 bg-gray-100 dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-800 aspect-3/1">
                            {coverImage ? (
                                <img
                                    src={coverImage}
                                    alt="Cover preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-linear-to-br from-main/40 via-gray-100 dark:via-zinc-800 to-gray-250 dark:to-zinc-900" />
                            )}
                        </div>
                        <div className="flex gap-2">
                            <SettingsButton
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('cover-upload').click()}
                            >
                                Change cover
                            </SettingsButton>
                            {coverImage && (
                                <SettingsButton
                                    type="button"
                                    variant="danger"
                                    onClick={() => setCoverImage(null)}
                                >
                                    Remove
                                </SettingsButton>
                            )}
                        </div>
                    </div>

                    {/* Profile photo block */}
                    <div className="space-y-3 pt-2">
                        <label className="block text-[15px] font-bold text-gray-900 dark:text-white">
                            Profile photo
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 dark:border-neutral-850 bg-gray-100 dark:bg-[#16181c] shrink-0 flex items-center justify-center">
                                {avatarImage ? (
                                    <img
                                        src={avatarImage}
                                        alt="Profile preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full text-3xl select-none  bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-bold text-main ">
                                        {usernameLetter}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <SettingsButton
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('avatar-upload').click()}
                                >
                                    Change photo
                                </SettingsButton>
                                {avatarImage && (
                                    <SettingsButton
                                        type="button"
                                        variant="danger"
                                        onClick={() => setAvatarImage(null)}
                                    >
                                        Remove
                                    </SettingsButton>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Name input */}
                    <div className="flex flex-col md:flex-row w-full gap-10">
                        <SettingsInput
                            label="First Name"
                            value={form.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />
                        <SettingsInput
                            label="Last Name"
                            value={form.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                        />
                    </div>

                    {/* Bio textarea */}
                    <div className="mb-5">
                        <label className="block text-[15px] font-bold text-gray-900 dark:text-white mb-2">
                            Bio
                        </label>
                        <div className="">
                            <textarea
                                className="w-full min-h-[100px] pt-4 px-4 pb-8 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:border-main focus:ring-main focus:ring-1 transition-colors text-[15px] resize-y"
                                value={form.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                maxLength={500}
                            />
                            <div className="text-end text-xs text-gray-400 dark:text-zinc-500 pointer-events-none select-none">
                                {(form.bio || '').length}/500
                            </div>
                        </div>

                    </div>

                    {/* Website input */}
                    <SettingsInput
                        label="Website"
                        value={form.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://"
                    />

                    {/* Birthday and Gender input */}
                    <div className="flex flex-col md:flex-row w-full gap-10">
                        <div className="flex-1">
                            <SettingsInput
                                label="Birthday"
                                type="date"
                                value={form.birthday || ''}
                                onChange={(e) => handleInputChange('birthday', e.target.value)}
                            />
                        </div>
                        <div className="flex-1 mb-5">
                            <label className="block text-[15px] font-bold text-gray-900 dark:text-white mb-2">
                                Gender
                            </label>
                            <select
                                className="w-full h-[48px] px-4 rounded-xl border bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-1 transition-colors text-[15px] border-gray-300 dark:border-gray-700 focus:border-main focus:ring-main cursor-pointer"
                                value={form.gender ?? 1}
                                onChange={(e) => handleInputChange('gender', Number(e.target.value))}
                            >
                                <option value={1}>Male</option>
                                <option value={2}>Female</option>
                                <option value={3}>Non-Binary</option>
                                <option value={4}>Prefer not to say</option>
                            </select>
                        </div>
                    </div>

                    {/* Save button */}
                    <div className="flex justify-end pt-2">
                        <SettingsButton
                            type="submit"
                            variant="primary"
                            disabled={isSaving || !isModified}
                            className='bg-main! hover:bg-main-hover!'>
                            {isSaving ? 'Saving...' : 'Save'}
                        </SettingsButton>
                    </div>
                </form>
            </div>

            {/* Cropping Modal */}
            {imageToCrop && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative bg-white dark:bg-[#18181b] border border-gray-200 dark:border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-150 dark:border-neutral-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Crop {cropType === 'avatar' ? 'Profile Photo' : 'Cover Photo'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setImageToCrop(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="relative w-full h-80 bg-neutral-950">
                            <Cropper
                                image={imageToCrop}
                                crop={crop}
                                zoom={zoom}
                                aspect={cropType === 'avatar' ? 1 : 3}
                                cropShape={cropType === 'avatar' ? 'round' : 'rect'}
                                showGrid={true}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>

                        <div className="p-5 border-t border-gray-150 dark:border-neutral-800 space-y-4 bg-gray-50/50 dark:bg-[#16181c]/30">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-zinc-400">
                                    <span>Zoom</span>
                                    <span>{zoom.toFixed(1)}x</span>
                                </div>
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    value={zoom}
                                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                                    className="w-full accent-main cursor-pointer"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <SettingsButton variant="outline" type="button" onClick={() => setImageToCrop(null)}>
                                    Cancel
                                </SettingsButton>
                                <SettingsButton variant="primary" type="button" className="bg-main! hover:bg-main-hover! text-white!" onClick={handleCropSave}>
                                    Apply Crop
                                </SettingsButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditProfileForm;

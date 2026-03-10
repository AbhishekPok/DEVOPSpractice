import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Mail, Calendar, Shield, Camera, Edit2, Save, X, CheckCircle2, AlertCircle } from 'lucide-react';

import styles from './profile.module.css';
import authService from '../../services/authService';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, errorMessage]);

    const fetchProfile = async () => {
        try {
            const data = await authService.getProfile();
            setUser(data);
            setFormData({
                first_name: data.first_name || '',
                last_name: data.last_name || ''
            });
        } catch (error) {
            console.error("Failed to fetch profile", error);
            setErrorMessage("Failed to load profile. Please refresh the page.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.first_name || !formData.last_name) {
            setErrorMessage("Please fill in both first and last name.");
            return;
        }

        setSaving(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const updatedUser = await authService.updateProfile(formData);
            setUser(updatedUser);
            setIsEditing(false);
            setSuccessMessage("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile", error);
            setErrorMessage("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            first_name: user.first_name || '',
            last_name: user.last_name || ''
        });
        setErrorMessage('');
    };

    const handleAvatarClick = () => {
        alert("Avatar upload functionality would be implemented here. This would open a file picker to select a new profile photo.");
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={`${styles.spinner} ${styles.spinnerLarge}`}></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-6 text-center">
                <Alert className={`${styles.alertError} max-w-md mx-auto`}>
                    <AlertCircle className={styles.alertIconError} />
                    <AlertDescription className={styles.alertTextError}>
                        Failed to load profile. Please try refreshing the page.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const initials = user.first_name
        ? `${user.first_name[0]}${user.last_name ? user.last_name[0] : ''}`.toUpperCase()
        : user.email[0].toUpperCase();

    const displayName = user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : user.username;

    const formattedDate = new Date(user.date_joined).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className={styles.container}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>My Profile</h1>
                <p className={styles.pageSubtitle}>Manage your personal information and account settings</p>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
                <Alert className={styles.alertSuccess}>
                    <CheckCircle2 className={styles.alertIconSuccess} />
                    <AlertDescription className={styles.alertTextSuccess}>
                        {successMessage}
                    </AlertDescription>
                </Alert>
            )}

            {errorMessage && (
                <Alert className={styles.alertError}>
                    <AlertCircle className={styles.alertIconError} />
                    <AlertDescription className={styles.alertTextError}>
                        {errorMessage}
                    </AlertDescription>
                </Alert>
            )}

            {/* Profile Header Card */}
            <div className={styles.profileCard}>
                {/* Banner */}
                <div className={styles.banner}></div>

                {/* Avatar - Absolute Positioned */}
                <div className={styles.avatarContainer}>
                    <div className={styles.avatarWrapper}>
                        <div className={styles.avatar}>
                            {user.first_name ? (
                                <span className={styles.avatarInitials}>{initials}</span>
                            ) : (
                                <User className={styles.avatarIcon} strokeWidth={1.5} />
                            )}
                        </div>
                        <button
                            onClick={handleAvatarClick}
                            className={styles.cameraButton}
                            title="Change profile picture"
                        >
                            <Camera className={styles.cameraIcon} />
                        </button>
                    </div>
                </div>

                {/* Profile Info Bar */}
                <div className={styles.profileInfo}>
                    <div className={styles.profileInfoContent}>
                        {/* Name and Details */}
                        <div className={styles.profileDetails}>
                            <h2 className={styles.profileName}>{displayName}</h2>
                            <p className={styles.profileUsername}>@{user.username}</p>
                            <div className={styles.profileBadges}>
                                <div className={styles.badge}>
                                    <Shield className={styles.badgeIconActive} />
                                    <span>Active Account</span>
                                </div>
                                <div className={styles.badge}>
                                    <Calendar className={styles.badgeIconCalendar} />
                                    <span>Joined {formattedDate}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className={styles.actionButtons}>
                            {!isEditing ? (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className={`${styles.btn} ${styles.btnDark}`}
                                >
                                    <Edit2 className={styles.btnIcon} />
                                    Edit Profile
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                    className={`${styles.btn} ${styles.btnOutline}`}
                                >
                                    <X className={styles.btnIcon} />
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.contentGrid}>
                {/* Left Sidebar - Account Summary */}
                <div className={styles.sidebar}>
                    <Card className={styles.summaryCard}>
                        <CardHeader className={styles.cardHeader}>
                            <CardTitle className={styles.cardTitle}>Account Summary</CardTitle>
                        </CardHeader>
                        <CardContent className={styles.cardContent}>
                            <div className={styles.summaryItem}>
                                <div className={`${styles.summaryIconWrapper} ${styles.summaryIconCalendar}`}>
                                    <Calendar className={styles.summaryIcon} />
                                </div>
                                <div className={styles.summaryContent}>
                                    <p className={styles.summaryLabel}>Member Since</p>
                                    <p className={styles.summaryValue}>
                                        {formattedDate}
                                    </p>
                                </div>
                            </div>

                            <Separator className={styles.separator} />

                            <div className={styles.summaryItem}>
                                <div className={`${styles.summaryIconWrapper} ${styles.summaryIconMail}`}>
                                    <Mail className={styles.summaryIcon} />
                                </div>
                                <div className={styles.summaryContent}>
                                    <p className={styles.summaryLabel}>Email Address</p>
                                    <p className={styles.summaryValue} title={user.email}>
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profile Completion Card */}
                    {(!user.first_name || !user.last_name) && !isEditing && (
                        <Card className={styles.completionCard}>
                            <CardHeader className="pb-3">
                                <CardTitle className={styles.completionTitle}>Complete Your Profile</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className={styles.completionText}>
                                    Add your name to personalize your account.
                                </p>
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    size="sm"
                                    className={`${styles.btn} ${styles.btnAmber}`}
                                >
                                    Complete Profile
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Main Content - Edit Form */}
                <div className={styles.mainContent}>
                    <Card className={styles.card}>
                        <CardHeader className={styles.cardHeader}>
                            <CardTitle className={styles.cardTitle}>Personal Details</CardTitle>
                            <CardDescription className={styles.cardDescription}>
                                {isEditing ? "Update your information below." : "Your personal information."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className={styles.cardContent}>
                            {isEditing ? (
                                <div>
                                    <div className={styles.formGrid}>
                                        <div className={styles.formField}>
                                            <Label htmlFor="first_name" className={styles.formLabel}>
                                                First Name <span className={styles.requiredAsterisk}>*</span>
                                            </Label>
                                            <Input
                                                id="first_name"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleInputChange}
                                                placeholder="e.g. John"
                                                className={styles.formInput}
                                            />
                                        </div>
                                        <div className={styles.formField}>
                                            <Label htmlFor="last_name" className={styles.formLabel}>
                                                Last Name <span className={styles.requiredAsterisk}>*</span>
                                            </Label>
                                            <Input
                                                id="last_name"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Doe"
                                                className={styles.formInput}
                                            />
                                        </div>
                                        <div className={`${styles.formField} ${styles.formFieldFullWidth}`}>
                                            <Label htmlFor="email" className={styles.formLabel}>Email Address</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={user.email}
                                                disabled
                                                className={`${styles.formInput} ${styles.formInputDisabled}`}
                                            />
                                            <p className={styles.formHelpText}>
                                                Email cannot be changed from this page. Contact support if you need to update your email.
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles.formActions}>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCancel}
                                            disabled={saving}
                                            className={`${styles.btn} ${styles.btnOutline}`}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSubmit}
                                            className={`${styles.btn} ${styles.btnPrimary}`}
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <>
                                                    <div className={styles.spinner}></div>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className={styles.btnIcon} />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className={styles.detailsGrid}>
                                        <div className={styles.detailItem}>
                                            <Label className={styles.detailLabel}>First Name</Label>
                                            <p className={styles.detailValue}>
                                                {user.first_name || <span className={styles.detailValueNotSet}>Not set</span>}
                                            </p>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <Label className={styles.detailLabel}>Last Name</Label>
                                            <p className={styles.detailValue}>
                                                {user.last_name || <span className={styles.detailValueNotSet}>Not set</span>}
                                            </p>
                                        </div>
                                    </div>

                                    <Separator className={styles.separator} />
                                    <div className={styles.detailItem}>
                                        <Label className={styles.detailLabel}>Email Address</Label>
                                        <p className={`${styles.detailValue} ${styles.detailValueBreakAll}`}>{user.email}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
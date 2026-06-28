import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const { height: screenHeight } = Dimensions.get('window');

interface BottomSheetModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    heightPercentage?: number;
}

export const BottomSheetModal: React.FC<BottomSheetModalProps> = ({ 
    visible, 
    onClose, 
    children, 
    heightPercentage = 0.75 
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { height: screenHeight * heightPercentage }]}>
                    <View style={styles.dragHandle} />
                    
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Feather name="x" size={24} color={Colors.black} />
                    </TouchableOpacity>

                    {children}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    dragHandle: {
        width: 60,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    closeButton: {
        position: 'absolute',
        top: 24,
        right: 24,
        zIndex: 10,
    }
});

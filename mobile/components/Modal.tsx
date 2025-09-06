import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/text';

interface ConfirmModalProps {
  visible: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: string;
  highlightedText?: string | string[];
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  icon,
  highlightedText,
}) => {
  // Debug logging
  console.log('🎯 ConfirmModal render - visible:', visible, 'title:', title);

  React.useEffect(() => {
    console.log('🎯 ConfirmModal visible prop changed:', visible);
  }, [visible]);
  const renderMessage = () => {
    if (!highlightedText) {
      return (
        <Text
          style={{
            fontSize: 16,
            color: '#374151',
            textAlign: 'center',
            lineHeight: 24,
          }}
        >
          {message}
        </Text>
      );
    }

    const textsToHighlight = Array.isArray(highlightedText)
      ? highlightedText.filter(text => text && text.trim() !== '')
      : [highlightedText].filter(text => text && text.trim() !== '');

    if (textsToHighlight.length === 0) {
      return (
        <Text
          style={{
            fontSize: 16,
            color: '#374151',
            textAlign: 'center',
            lineHeight: 24,
          }}
        >
          {message}
        </Text>
      );
    }

    const escapedTexts = textsToHighlight.map(text =>
      text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    );
    const pattern = new RegExp(`(${escapedTexts.join('|')})`, 'gi');

    const parts = message.split(pattern);

    return (
      <Text
        style={{
          fontSize: 16,
          color: '#374151',
          textAlign: 'center',
          lineHeight: 24,
        }}
      >
        {parts.map((part, index) => {
          const shouldHighlight = textsToHighlight.some(
            text => text.toLowerCase() === part.toLowerCase(),
          );

          return shouldHighlight ? (
            <Text
              key={index}
              style={{
                color: '#2e1e39',
                fontWeight: '600',
              }}
            >
              {part}
            </Text>
          ) : (
            <Text key={index}>{part}</Text>
          );
        })}
      </Text>
    );
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      statusBarTranslucent={true}
      onRequestClose={onCancel}
    >
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            paddingVertical: 32,
            paddingHorizontal: 24,
            width: '100%',
            maxWidth: 400,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 15,
          }}
        >
          {/* Header with icon and title */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            {icon && (
              <MaterialIcons
                name={icon as any}
                size={20}
                color="#2e1e39"
                style={{ marginRight: 8 }}
              />
            )}
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                flex: 1,
                color: '#2e1e39',
              }}
            >
              {title}
            </Text>
          </View>

          <View style={{ marginBottom: 32 }}>{renderMessage()}</View>

          {/* Buttons */}
          <View
            style={{
              flexDirection: 'row',
              gap: 12,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 16,
                paddingHorizontal: 20,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 52,
                backgroundColor: '#2e1e39',
              }}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 16,
                paddingHorizontal: 20,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 52,
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderColor: '#D1D5DB',
              }}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  color: '#6B7280',
                  fontSize: 16,
                  fontWeight: '500',
                }}
              >
                {cancelText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;

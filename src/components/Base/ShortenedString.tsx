import { useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useTranslation } from '../../translations';
import { isMobile } from '../../utils/responsive';

type Props = {
  text: string;
  maxLength: number;
  className?: string;
};

export default function ShortenedString({ text, maxLength, className = '' }: Props) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const textLength = text?.length;

  const formattedText = text
    ?.split(';')
    .map(email => email.trim())
    .join('\n');

  return (
    <>
      <p
        className={`mb-0 ${className || ''}`}
        title={textLength > maxLength ? formattedText : undefined}
        onClick={e => {
          e.stopPropagation();
          if (isMobile && textLength > maxLength) {
            setIsModalOpen(true);
          }
        }}
      >
        {textLength > maxLength ? `${formattedText.substring(0, maxLength + 1)}...` : formattedText}
        {textLength > maxLength && isMobile && <i className="mdi mdi-eye text-primary ml-1" />}
      </p>
      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)}>
        <ModalHeader toggle={() => setIsModalOpen(false)}>{formattedText?.substring(0, 30)}...</ModalHeader>
        <ModalBody style={{ overflowWrap: 'break-word', whiteSpace: 'normal' }}>
          {formattedText?.split('\n').map((email, index) => (
            <div key={index}>{email}</div>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button color="default" onClick={() => setIsModalOpen(false)} className="ml-auto">
            {t('fermer')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

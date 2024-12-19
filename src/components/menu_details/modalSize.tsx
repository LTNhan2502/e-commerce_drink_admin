import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface ModalSizeProps {
    show: boolean;
    handleClose: () => void;
}

function ModalSize({ show, handleClose }: ModalSizeProps) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Thêm Size Mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>{/* Thêm form input ở đây */}</Modal.Body>
            <Modal.Footer>
                <Button variant='primary' onClick={handleClose}>
                    Thêm
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalSize;

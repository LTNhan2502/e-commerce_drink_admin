import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface ModalToppingProps {
    show: boolean;
    handleClose: () => void;
}

function ModalTopping({ show, handleClose }: ModalToppingProps) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Thêm Topping Mới</Modal.Title>
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

export default ModalTopping;

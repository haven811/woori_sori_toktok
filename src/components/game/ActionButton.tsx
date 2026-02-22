import sangmoButton from '@/assets/button-sangmo.png';
import kkwaenggwariButton from '@/assets/button-kkwaenggwari.png';
import shoesButton from '@/assets/button-shoes.png';

interface ActionButtonProps {
  type: 'sangmo' | 'kkwaenggwari' | 'shoes';
  onClick: () => void;
  disabled?: boolean;
}

const ActionButton = ({ type, onClick, disabled }: ActionButtonProps) => {
  const getButtonImage = () => {
    switch (type) {
      case 'sangmo':
        return sangmoButton;
      case 'kkwaenggwari':
        return kkwaenggwariButton;
      case 'shoes':
        return shoesButton;
      default:
        return '';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28
        rounded-full
        flex items-center justify-center
        transform transition-all duration-100
        hover:scale-110 active:scale-90
        disabled:opacity-50 disabled:cursor-not-allowed
        overflow-hidden
        shadow-lg hover:shadow-xl
      `}
    >
      <img 
        src={getButtonImage()} 
        alt={type} 
        className="w-full h-full object-cover"
      />
    </button>
  );
};

export default ActionButton;

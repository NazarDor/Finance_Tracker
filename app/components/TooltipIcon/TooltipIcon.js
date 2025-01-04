import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import './TooltipIcon.css';

const TooltipIcon = ({ description }) => {
  return (
    <span className="desc">
      <FontAwesomeIcon
        icon={faCircleInfo}
      />
      <div className="tooltip">{description}</div>
    </span>
  );
};

export default TooltipIcon;

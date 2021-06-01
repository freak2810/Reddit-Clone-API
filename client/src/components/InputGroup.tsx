import classNames from 'classnames';

interface InputGroupProps {
	className?: string;
	type: string;
	placeholder: string;
	value: string;
	error: string | undefined;
	setValue: (str: string) => void;
}

const InputGroup: React.FC<InputGroupProps> = ({
	className,
	type,
	placeholder,
	value,
	error,
	setValue,
}) => {
	return (
		<div className={className}>
			<input
				value={value}
				onChange={e => setValue(e.target.value)}
				type={type}
				placeholder={placeholder}
				className={classNames(
					'w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white',
					error ? 'border-red-500' : ''
				)}
			/>
			<small className="font-medium text-red-600">{error}</small>
		</div>
	);
};

export default InputGroup;

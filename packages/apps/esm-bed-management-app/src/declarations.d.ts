declare module '*.scss' {
	const styles: Record<string, string>;
	export default styles;
}

declare module '*.css' {
	const styles: Record<string, string>;
	export default styles;
}

declare module '*.png' {
	const value: string;
	export default value;
}

declare module '*.svg' {
	const value: string;
	export default value;
}

declare type SideNavProps = object;

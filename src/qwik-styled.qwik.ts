import {
	Slot,
	component$,
	jsx,
	type Component,
	type PropsOf,
} from '@builder.io/qwik'

// Copied from HtmlIntrinsiceElements because I couldn't make `keyof QwikIntrinsicElements` work well
export type Tags =
	| 'a'
	| 'abbr'
	| 'address'
	| 'area'
	| 'article'
	| 'aside'
	| 'audio'
	| 'b'
	| 'base'
	| 'bdi'
	| 'bdo'
	| 'big'
	| 'blockquote'
	| 'body'
	| 'br'
	| 'button'
	| 'canvas'
	| 'caption'
	| 'cite'
	| 'code'
	| 'col'
	| 'colgroup'
	| 'data'
	| 'datalist'
	| 'dd'
	| 'del'
	| 'details'
	| 'dfn'
	| 'dialog'
	| 'div'
	| 'dl'
	| 'dt'
	| 'em'
	| 'embed'
	| 'fieldset'
	| 'figcaption'
	| 'figure'
	| 'footer'
	| 'form'
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'h5'
	| 'h6'
	| 'head'
	| 'header'
	| 'hgroup'
	| 'hr'
	| 'html'
	| 'i'
	| 'iframe'
	| 'img'
	| 'input'
	| 'ins'
	| 'kbd'
	| 'keygen'
	| 'label'
	| 'legend'
	| 'li'
	| 'link'
	| 'main'
	| 'map'
	| 'mark'
	| 'menu'
	| 'menuitem'
	| 'meta'
	| 'meter'
	| 'nav'
	| 'noindex'
	| 'noscript'
	| 'object'
	| 'ol'
	| 'optgroup'
	| 'option'
	| 'output'
	| 'p'
	| 'param'
	| 'picture'
	| 'pre'
	| 'progress'
	| 'q'
	| 'rp'
	| 'rt'
	| 'ruby'
	| 's'
	| 'samp'
	| 'slot'
	| 'script'
	| 'section'
	| 'select'
	| 'small'
	| 'source'
	| 'span'
	| 'strong'
	| 'style'
	| 'sub'
	| 'summary'
	| 'sup'
	| 'table'
	| 'template'
	| 'tbody'
	| 'td'
	| 'textarea'
	| 'tfoot'
	| 'th'
	| 'thead'
	| 'time'
	| 'title'
	| 'tr'
	| 'track'
	| 'tt'
	| 'u'
	| 'ul'
	| 'video'
	| 'wbr'
	| 'webview'

export type QwikStyledComponent<Tag extends Tags = 'div'> = Component<
	PropsOf<Tag>
> & {class: string}

export const isStyled = (o: any): o is QwikStyledComponent =>
	typeof o === 'function' && 'class' in o

export const styled = <Tag extends Tags>(
	Tag: Tag,
	myClassName: string
): Component<PropsOf<Tag>> & {class: string} => {
	const Lite = ({class: extraClass, ...props}: {[x: string]: any}) => {
		let classes: string[] | undefined
		const check = (cl?: string | {[c: string]: boolean}) => {
			if (!cl) return
			if (!classes) classes = [myClassName]
			if (typeof cl === 'object')
				classes.push(
					Object.entries(cl)
						.filter(([, v]) => v)
						.map(([c]) => c)
						.join(' ')
				)
			else classes.push(cl)
		}
		check(extraClass)
		return jsx(
			TagComponent,
			// @ts-ignore
			{
				...props,
				Tag,
				class: extraClass ? [myClassName, extraClass] : myClassName,
			}
		)
	}
	// To allow interpolation
	Lite.class = myClassName
	// getter for deprecated className
	Object.defineProperty(Lite, 'className', {
		get: () => myClassName,
		enumerable: false,
	})
	Lite.toString = () => myClassName
	return Lite
}

//To allow named slots
const TagComponent = component$<{Tag: string; [x: PropertyKey]: any}>(
	({Tag, ...props}) => {
		return jsx(Tag, {...props, children: jsx(Slot, {})})
	}
)

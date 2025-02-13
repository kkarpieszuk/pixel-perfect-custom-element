/**
 * Web Component for <pixel-perfect> element.
 */

const template = document.createElement('template');
template.innerHTML = `
	<style>
		:host {
			display: block;
			position: absolute;
			z-index: 	z-index: 99999999999999999999999999999999999999999999999999999999999999999999999999;
			right: 0;
			bottom: 0;
			width: auto;
			height: auto;

			font-family: sans-serif;

			--color-bg:rgb(71, 164, 230);
			--color-fg:rgb(158, 207, 241);
			--color-white:rgb(255, 255, 255);
		}
		.dialog {
			margin: 2em;
			display: grid;
			grid-template-rows: 1fr auto;
			justify-items: center;

			.image-preview {
				background-repeat: no-repeat;
				background-position: center;
				height: 2em;
				background-color: var(--color-bg);
				color: var(--color-white);
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0.3em;

				cursor: move;
				user-select: none;

				opacity: 0.5;
				transition: opacity 0.15s;
			}

			.toolbar {
				padding: 0.5em;
				display: flex;
				justify-content: space-between;
				gap: 1em;

				button {
					all: unset;
					border: 1px solid var(--color-fg);
					background: var(--color-bg);
					width: 2em;
					height: 1em;
					border-radius: 0.3em;
					cursor: pointer;
					justify-content: center;
					align-items: center;
					display: inline-flex;

					svg {
						width: 15px;
						height: 15px;
					}
				}

				input[type="range"] {
					all: unset;
					height: 1em;

					&::-webkit-slider-runnable-track {
						width: 100%;
						height: 0.1em;
						background: linear-gradient(to right,
							var(--color-bg) 0%,
							var(--color-bg) calc(var(--value, 0%) * 100%),
							var(--color-fg) calc(var(--value, 0%) * 100%)
						);
						border-radius: 0.5em;
						cursor: pointer;
					}

					/* thumb styles */
					&::-webkit-slider-thumb {
						-webkit-appearance: none;
						width: 0.5em;
						height: 0.5em;
						background: var(--color-bg);
						border-radius: 0.5em;
						cursor: pointer;
						margin-top: -0.25em;
					}
				}

				.replace-image {
					display: none;
				}
			}
		}
	</style>
	<div class="dialog">
		<div class="image-preview">image not loaded</div>
		<div class="toolbar">
			<button class="revert">
				<svg viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
				<path d="M4,14 C4,11.0544813 6.66666667,7.05448133 12,2 C17.3333333,7.05448133 20,11.0544813 20,14 C20,18.3349143 16.5521622,21.8645429 12.2491793,21.9961932 L12,22 C7.581722,22 4,18.418278 4,14 Z M12,4.793 L11.7832437,5.01193635 C7.89798368,8.95774552 6,12.0287291 6,14 C6,17.3137085 8.6862915,20 12,20 L12,4.793 Z"/>
				</svg>
			</button>
			<input type="range" min="0" max="1" step="0.01" value="0.5" class="opacity-slider">
			<input type="file" accept="image/*" class="replace-image">
			<button class="trigger-upload">
				<svg viewBox="0 0 24 24"  fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M14.2647 15.9377L12.5473 14.2346C11.758 13.4519 11.3633 13.0605 10.9089 12.9137C10.5092 12.7845 10.079 12.7845 9.67922 12.9137C9.22485 13.0605 8.83017 13.4519 8.04082 14.2346L4.04193 18.2622M14.2647 15.9377L14.606 15.5991C15.412 14.7999 15.8149 14.4003 16.2773 14.2545C16.6839 14.1262 17.1208 14.1312 17.5244 14.2688C17.9832 14.4253 18.3769 14.834 19.1642 15.6515L20 16.5001M14.2647 15.9377L18.22 19.9628M18.22 19.9628C17.8703 20 17.4213 20 16.8 20H7.2C6.07989 20 5.51984 20 5.09202 19.782C4.7157 19.5903 4.40973 19.2843 4.21799 18.908C4.12583 18.7271 4.07264 18.5226 4.04193 18.2622M18.22 19.9628C18.5007 19.9329 18.7175 19.8791 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V13M11 4H7.2C6.07989 4 5.51984 4 5.09202 4.21799C4.7157 4.40973 4.40973 4.71569 4.21799 5.09202C4 5.51984 4 6.0799 4 7.2V16.8C4 17.4466 4 17.9066 4.04193 18.2622M18 9V6M18 6V3M18 6H21M18 6H15" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
		</div>
	</div>
`;

class PixelPerfect extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: 'open' });
		shadow.appendChild(template.content.cloneNode(true));

		this.invertVal = localStorage.getItem('pixelPerfectInvert') || 0;

		this.dialogElement = this.shadowRoot.querySelector('.dialog');
		this.imageElement = this.shadowRoot.querySelector('.image-preview');
		this.replaceImageInput = this.shadowRoot.querySelector('.replace-image');
		this.opacitySlider = this.shadowRoot.querySelector('.opacity-slider');

		this.imageElement.style.filter = `invert(${this.invertVal})`;

		this.opacitySlider.style.setProperty('--value', this.opacitySlider.value);

		this.shadowRoot.querySelector('.revert').addEventListener('click', () => {
			this.revertColors();
		});

		this.imageElement.style.opacity = localStorage.getItem('pixelPerfectOpacity');
		this.opacitySlider.style.setProperty('--value', this.imageElement.style.opacity);
		this.opacitySlider.value = this.imageElement.style.opacity;

		this.opacitySlider.addEventListener('input', (e) => {
			this.imageElement.style.opacity = e.target.value;
			e.target.style.setProperty('--value', e.target.value);

			localStorage.setItem('pixelPerfectOpacity', e.target.value);
		});

		this.shadowRoot.querySelector('.trigger-upload').addEventListener('click', () => {
			this.replaceImageInput.click();
		});

		this.replaceImageInput.addEventListener('change', (e) => {
			const file = e.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const img = new Image();
					img.onload = () => {
						this.updateImageFromUpload(e.target.result, img.width, img.height);
					};
					img.src = e.target.result;
				};
				reader.readAsDataURL(file);
			}
		});

		this.loadSavedImageData();

		// Dodaj zmienne do obsługi przeciągania
		this.isDragging = false;
		this.currentX = 0;
		this.currentY = 0;
		this.initialX = 0;
		this.initialY = 0;
		this.xOffset = 0;
		this.yOffset = 0;


		const position = JSON.parse(localStorage.getItem('pixelPerfectPosition'));

		if ( position ) {
			this.dialogElement.style.transform = `translate(${position.x}px, ${position.y}px)`;

			this.xOffset = position.x;
			this.yOffset = position.y;
		}

		// Dodaj obsługę przeciągania
		this.setupDragging();
	}

	static get observedAttributes() {
		return ['img'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'img' && newValue.length ) {
			this.updateImage(newValue);
		}
	}

	saveImageData(src, width, height) {
		const imageData = {
			src: src,
			width: width,
			height: height,
		};
		try {
			localStorage.setItem('pixelPerfectImage', JSON.stringify(imageData));
			console.log('Image data saved successfully');
		} catch (e) {
			console.error('Error saving image data:', e);
		}
	}

	loadSavedImageData() {
		try {
			const savedData = localStorage.getItem('pixelPerfectImage');
			if (savedData) {
				const imageData = JSON.parse(savedData);
				console.log('Loading saved image data:', imageData);
				this.updateImageFromUpload(imageData.src, imageData.width, imageData.height);
			}
		} catch (e) {
			console.error('Error loading image data:', e);
		}
	}

	updateImage(src) {
		const img = new Image();
		img.src = src;
		img.onload = () => {
			this.imageElement.style.backgroundImage = `url(${src})`;
			this.imageElement.style.width = `${img.width}px`;
			this.imageElement.style.height = `${img.height}px`;
			this.imageElement.style.backgroundColor = 'transparent';
			this.imageElement.style.color = 'transparent';
			this.imageElement.style.padding = 0;

			this.saveImageData(src, img.width, img.height);
		};
	}

	updateImageFromUpload(src, width, height) {
		this.imageElement.style.backgroundImage = `url(${src})`;
		this.imageElement.style.width = `${width}px`;
		this.imageElement.style.height = `${height}px`;
		this.imageElement.style.backgroundColor = 'transparent';
		this.imageElement.style.color = 'transparent';
		this.imageElement.style.padding = 0;

		this.saveImageData(src, width, height);
	}

	revertColors() {
		this.invertVal = Number(this.invertVal) === 1 ? 0 : 1;

		this.imageElement.style.filter = `invert(${this.invertVal})`;

		localStorage.setItem('pixelPerfectInvert', this.invertVal);
	}

	setupDragging() {
		// Dodaj tabindex aby element mógł otrzymywać focus
		this.imageElement.setAttribute('tabindex', '0');

		// Dodaj event listenery
		this.imageElement.addEventListener('mousedown', this.dragStart.bind(this));
		document.addEventListener('mousemove', this.drag.bind(this));
		document.addEventListener('mouseup', this.dragEnd.bind(this));

		// Obsługa klawiszy
		this.imageElement.addEventListener('click', function() {
			this.focus();
		});

		document.addEventListener('keydown', (e) => {
			if (!this.imageElement.matches(':focus')) return;

			const moveAmount = e.shiftKey ? 100 : 1;

			switch(e.key) {
				case 'ArrowUp':
					this.yOffset -= moveAmount;
					break;
				case 'ArrowDown':
					this.yOffset += moveAmount;
					break;
				case 'ArrowLeft':
					this.xOffset -= moveAmount;
					break;
				case 'ArrowRight':
					this.xOffset += moveAmount;
					break;
				default:
					return;
			}

			e.preventDefault();
			this.setTranslate(this.xOffset, this.yOffset);
		});
	}

	dragStart(e) {
		this.initialX = e.clientX - this.xOffset;
		this.initialY = e.clientY - this.yOffset;

		if (e.target === this.imageElement) {
			this.isDragging = true;
		}
	}

	drag(e) {
		if (this.isDragging) {
			e.preventDefault();

			this.currentX = e.clientX - this.initialX;
			this.currentY = e.clientY - this.initialY;

			this.xOffset = this.currentX;
			this.yOffset = this.currentY;

			this.setTranslate(this.currentX, this.currentY);
		}
	}

	dragEnd(e) {
		this.initialX = this.currentX;
		this.initialY = this.currentY;
		this.isDragging = false;
	}

	setTranslate(xPos, yPos) {
		this.xOffset = xPos;
		this.yOffset = yPos;
		this.dialogElement.style.transform = `translate(${xPos}px, ${yPos}px)`;

		localStorage.setItem('pixelPerfectPosition', JSON.stringify({ x: xPos, y: yPos }));
	}
}

customElements.define('pixel-perfect', PixelPerfect);
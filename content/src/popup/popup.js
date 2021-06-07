/*
 * Copyright 2020-2021 Oren Trutner
 *
 * This file is part of Reading Ruler.
 *
 * Reading Ruler is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Reading Ruler is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Reading Ruler.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * This is the entry point for the add-on's "popup" script.  This script
 * executes in the tiny web "page" showing the extenadd-onsion's dropdown menu when
 * you click the add-on's icon.
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Activate the ruler when the popup is shown.
    broadcast('activate');

    // Read the add-on's options.
    const tab = await getCurrentTab();
    const options = new Options(tab.url);
    await options.read();

    // Initialize and react to changes on the color chooser.
    const colorButtons = document.getElementById('colorButtons');
    for (let color of COLORS) {
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'color';
        input.id = 'color' + color.name;
        input.value = color.name;
        input.checked = color.name === options.colorName;
        colorButtons.appendChild(input);

        const label = document.createElement('label');
        label.htmlFor = input.id;
        label.style = `background-color: ${color.hex};`;
        label.innerHTML = color.icon ? `<img src="${color.icon}" width="30" height="30">` : ' ';
        label.addEventListener('click', async e => {
            options.colorName = e.target.previousSibling.value;
            options.appearance = color.appearance;
            await options.write();
        });
        colorButtons.appendChild(label);
    }

    // Initialize and react to changes on the opacity slider.
    const opacitySlider = document.getElementById('opacitySlider');
    opacitySlider.value = options.opacity;
    opacitySlider.addEventListener('input', async e => {
        options.opacity = opacitySlider.value;
        await options.write();
    });

    // Initialize and react to changes on the enable-for-domain checkbox.
    const enableForDomainCheckbox = document.getElementById('enableForDomain');
    enableForDomainCheckbox.checked = options.domainEnabled;
    enableForDomainCheckbox.addEventListener('change', async e => {
        options.domainEnabled = e.target.checked;
        await options.write();
    });

    // Initialize and react to changes on the enable-for-page checkbox.
    const enableForPageCheckbox = document.getElementById('enableForPage');
    enableForPageCheckbox.checked = options.pageEnabled;
    enableForPageCheckbox.addEventListener('change', async e => {
        options.pageEnabled = e.target.checked;
        await options.write();
    });

    // Activate the ruler when entering the popup.  This gives direct feedback
    // to what option changes look like, and counters the deactivation of the
    // ruler when the mouse exits the window to open the popup.
    document.documentElement.addEventListener('mouseenter', e => broadcast('activate'));
    document.documentElement.addEventListener('mouseleave', e => broadcast('deactivate'));

    // Deactivate the ruler when the popup closes.
    window.addEventListener('blur', e => {
        if (e.target === window) {
            broadcast('deactivate');
        }
    });
}, false);

import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-windmill-overlay',
    version: '0.1.1',
    icon: '💨',
    title: 'Windmill Overlay',
    description: 'Show windmills on Windy map.',
    author: 'DuckSoft',
    repository: 'https://github.com/DuckSoft/windy-plugin-windmill-overlay',
    desktopUI: 'embedded',
    mobileUI: 'small',
    routerPath: '/windmill-overlay',
};

export default config;

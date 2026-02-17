import PixelSnow from '../components/PixelSnow';

import React from "react";
const LandingPage: React.FC = () => {
    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative', backgroundColor: '#000000' }}>
            <PixelSnow
                color="#c4e7ff"
                flakeSize={0.032}
                minFlakeSize={1.25}
                pixelResolution={1000}
                speed={1.6}
                density={0.35}
                direction={125}
                brightness={1.5}
                depthFade={4}
                farPlane={18}
                gamma={0.4545}
                variant="snowflake"
            />
        </div>
    );
};

export default LandingPage;

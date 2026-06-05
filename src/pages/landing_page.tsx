import LandingPageEffect from '../components/LandingPage';
import React from "react";

const LandingPage: React.FC = () => {
    return (
        <LandingPageEffect
            color="#ffffff"
            flakeSize={0.02}
            minFlakeSize={1.0}
            pixelResolution={800}
            speed={1.0}
            density={0.25}
            direction={125}
            brightness={1.2}
            depthFade={6}
            farPlane={20}
            gamma={0.4545}
            variant="snowflake"
        />
    );
};

export default LandingPage;

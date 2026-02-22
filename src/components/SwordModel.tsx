import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const SwordModel: React.FC = () => {
    const { scene } = useGLTF("/src/assets/ice_sword.glb");
    const meshRef = useRef<THREE.Group>(null);
    const { mouse } = useThree();
    const prevMouseY = useRef(0);

    useFrame(() => {
        if (meshRef.current) {
            // Track mouse movement delta
            const deltaY = mouse.y - prevMouseY.current;
            prevMouseY.current = mouse.y;

            // Apply movement influence (multiplied for better response)
            // We use a high multiplier because mouse.y is -1 to 1 but delta is small per frame
            meshRef.current.rotation.x += deltaY * 10;

            // Slowly lerp back to 0.25
            meshRef.current.rotation.x = THREE.MathUtils.lerp(
                meshRef.current.rotation.x,
                0.25,
                0.05
            );

            // Lock position and other rotation axes
            meshRef.current.position.z = -0.5;
            meshRef.current.rotation.y = 3.14;
            meshRef.current.rotation.z = 0;
        }
    });

    return (
        <group ref={meshRef} dispose={null} scale={[5.9, 5.9, 5.9]} position={[.75, 1.6, 0]}>
            <primitive object={scene} />
        </group>
    );
};

export default SwordModel;

// Preload the model
useGLTF.preload("/src/assets/ice_sword.glb");

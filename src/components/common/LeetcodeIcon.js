import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

const LeetcodeIcon = props => {
    const { width, height } = props;

    return (
        <Svg height={width} width={height} viewBox="0 0 90 77" {...props}>
            <G fill="none" fillRule="evenodd">
            <Path
                d="M53.976 34.424a2.639 2.639 0 0 1 3.736.006 2.65 2.65 0 0 1-.006 3.743l-4.589 4.582c-4.233 4.227-11.137 4.289-15.442.142-.025-.023-1.942-1.903-8.266-8.104-4.207-4.125-4.626-10.726-.667-14.965l7.382-7.903c3.929-4.208 11.172-4.668 15.664-1.035l6.704 5.422a2.65 2.65 0 0 1 .396 3.722 2.639 2.639 0 0 1-3.715.397l-6.704-5.422c-2.35-1.9-6.46-1.64-8.487.532l-7.381 7.904c-1.928 2.063-1.716 5.387.505 7.565l8.226 8.067c2.238 2.156 5.857 2.123 8.055-.07z"
                fill="#ffa116"
                fillRule="nonzero"
            />
            <Path
                d="M42.828 29.838a2.644 2.644 0 0 1-2.642-2.646 2.644 2.644 0 0 1 2.642-2.647h19.485a2.644 2.644 0 0 1 2.642 2.647 2.644 2.644 0 0 1-2.642 2.646z"
                fill="#b3b3b3"
            />
            <Path
                d="M46.477.839a2.639 2.639 0 0 1 3.735-.125 2.65 2.65 0 0 1 .124 3.74L32.6 23.445c-1.927 2.064-1.716 5.388.505 7.566l8.19 8.032a2.65 2.65 0 0 1 .04 3.742 2.639 2.639 0 0 1-3.736.04l-8.19-8.031c-4.208-4.125-4.627-10.726-.668-14.965zM1.952 61.96v11.352c0 .436.154.808.464 1.118.31.31.682.464 1.118.464h3.07c.267 0 .496.095.686.285.19.19.285.418.285.686v.02a.9.9 0 0 1-.285.676.935.935 0 0 1-.686.285h-3.07c-.977 0-1.81-.345-2.5-1.034S0 74.289 0 73.312V61.96c0-.267.095-.496.285-.686A.94.94 0 0 1 .96 61h.032a.94.94 0 0 1 .675.274c.19.19.285.419.285.686zm12.227 5.338a3.68 3.68 0 0 0-2.7 1.119c-.74.745-1.109 1.645-1.109 2.7 0 .19.015.377.043.56l6.678-3.018c-.76-.907-1.73-1.36-2.912-1.36zm5.233 1.393a.93.93 0 0 1 .031.738.93.93 0 0 1-.506.538 3054.342 3054.342 0 0 0-7.754 3.503c.76.97 1.758 1.456 2.996 1.456.823 0 1.568-.243 2.237-.728a3.729 3.729 0 0 0 1.36-1.836c.155-.436.465-.654.929-.654.33 0 .594.137.791.412.19.267.229.559.116.875a5.547 5.547 0 0 1-2.068 2.764 5.623 5.623 0 0 1-3.365 1.087c-1.59 0-2.947-.563-4.072-1.688-1.126-1.125-1.688-2.483-1.688-4.072s.562-2.947 1.688-4.073c1.125-1.125 2.482-1.688 4.072-1.688 1.146 0 2.194.313 3.144.94a5.633 5.633 0 0 1 2.089 2.426zm7.606-1.393a3.68 3.68 0 0 0-2.7 1.119c-.74.745-1.108 1.645-1.108 2.7 0 .19.014.377.042.56l6.678-3.018c-.76-.907-1.73-1.36-2.912-1.36zm5.233 1.393a.93.93 0 0 1 .031.738.93.93 0 0 1-.506.538 3054.342 3054.342 0 0 0-7.754 3.503c.76.97 1.758 1.456 2.996 1.456.823 0 1.568-.243 2.237-.728a3.729 3.729 0 0 0 1.36-1.836c.155-.436.465-.654.929-.654.33 0 .594.137.791.412.19.267.229.559.116.875a5.547 5.547 0 0 1-2.068 2.764 5.623 5.623 0 0 1-3.365 1.087c-1.59 0-2.947-.563-4.072-1.688s-1.688-2.483-1.688-4.072.563-2.947 1.688-4.073c1.125-1.125 2.483-1.688 4.072-1.688 1.147 0 2.194.313 3.144.94a5.633 5.633 0 0 1 2.089 2.426zM35.405 61a.94.94 0 0 1 .675.274c.19.19.285.419.285.686v3.365h1.9c.26 0 .484.095.674.285.19.19.285.419.285.686v.021a.9.9 0 0 1-.285.675.923.923 0 0 1-.675.285h-1.899v6.573c0 .288.102.534.306.738.204.204.454.306.75.306h.843c.26 0 .485.095.675.285.19.19.285.418.285.686v.02a.9.9 0 0 1-.285.676.923.923 0 0 1-.675.285h-.844c-.83 0-1.54-.292-2.13-.876a2.91 2.91 0 0 1-.876-2.12V61.96c0-.267.094-.496.284-.686a.94.94 0 0 1 .676-.274zm12.955 0c.669 0 1.326.08 1.973.243.485.126.728.436.728.928v.032a.92.92 0 0 1-.38.76.912.912 0 0 1-.823.168 5.992 5.992 0 0 0-1.498-.19c-1.645 0-3.052.584-4.22 1.751s-1.75 2.578-1.75 4.23c0 1.654.583 3.064 1.75 4.231 1.168 1.16 2.575 1.741 4.22 1.741.507 0 1.006-.06 1.498-.18a.912.912 0 0 1 .823.17c.254.19.38.443.38.76v.02c0 .5-.243.813-.728.94a8.104 8.104 0 0 1-1.973.242c-2.187 0-4.054-.774-5.602-2.321-1.547-1.547-2.32-3.415-2.32-5.602s.773-4.055 2.32-5.602C44.306 61.774 46.173 61 48.36 61zm9.833 6.298a3.68 3.68 0 0 0-2.701 1.119c-.738.745-1.108 1.645-1.108 2.7 0 1.048.37 1.945 1.108 2.69a3.68 3.68 0 0 0 2.7 1.119c1.056 0 1.953-.373 2.691-1.119.746-.745 1.118-1.642 1.118-2.69a3.68 3.68 0 0 0-1.118-2.7c-.738-.746-1.635-1.119-2.69-1.119zm0-1.973c1.59 0 2.947.563 4.072 1.688 1.125 1.126 1.688 2.483 1.688 4.073s-.563 2.947-1.688 4.072-2.483 1.688-4.072 1.688c-1.59 0-2.947-.563-4.072-1.688-1.126-1.125-1.688-2.483-1.688-4.072s.562-2.947 1.688-4.073c1.125-1.125 2.482-1.688 4.072-1.688zm12.997 1.973a3.68 3.68 0 0 0-2.7 1.119c-.74.745-1.108 1.645-1.108 2.7 0 1.048.369 1.945 1.107 2.69.746.746 1.646 1.119 2.701 1.119s1.952-.373 2.69-1.119c.746-.745 1.119-1.642 1.119-2.69a3.68 3.68 0 0 0-1.119-2.7c-.738-.746-1.635-1.119-2.69-1.119zM75.99 61a.94.94 0 0 1 .676.274c.19.19.284.419.284.686v9.157c-.007 1.583-.573 2.933-1.698 4.051-1.125 1.119-2.48 1.678-4.062 1.678-1.59 0-2.947-.563-4.072-1.688s-1.688-2.483-1.688-4.072.563-2.947 1.688-4.073c1.125-1.125 2.483-1.688 4.072-1.688 1.449 0 2.718.482 3.809 1.446V61.96c0-.267.095-.496.284-.686A.94.94 0 0 1 75.96 61zm8.514 6.298a3.68 3.68 0 0 0-2.7 1.119c-.74.745-1.108 1.645-1.108 2.7 0 .19.014.377.042.56l6.678-3.018c-.76-.907-1.73-1.36-2.912-1.36zm5.233 1.393a.93.93 0 0 1 .031.738.93.93 0 0 1-.506.538 3054.342 3054.342 0 0 0-7.754 3.503c.76.97 1.758 1.456 2.996 1.456.823 0 1.568-.243 2.237-.728a3.729 3.729 0 0 0 1.36-1.836c.155-.436.465-.654.929-.654.33 0 .594.137.791.412.19.267.229.559.116.875a5.547 5.547 0 0 1-2.068 2.764 5.623 5.623 0 0 1-3.365 1.087c-1.59 0-2.947-.563-4.072-1.688-1.126-1.125-1.688-2.483-1.688-4.072s.562-2.947 1.688-4.073c1.125-1.125 2.483-1.688 4.072-1.688 1.146 0 2.194.313 3.144.94a5.633 5.633 0 0 1 2.089 2.426z"
                fill="#000"
            />
            </G>
        </Svg>
    );
};

LeetcodeIcon.defaultProps = {
    width: 135,
    height: 135,
};

export default LeetcodeIcon;
